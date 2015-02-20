#!/bin/bash

if [ "$(id -u)" != "0" ]; then
	echo "This script must be run as root" 1>&2
	[ -z "$DEBUG" ] && exit 1
fi

ADD_OPTS=
AUTORUN=
DAEMON_NAME=
DIRECTORY=
ENTRY_POINT="FcgiEntryPoint"
LIBRARY="libsbis-rpc-service300.so"
FCGI_PORT=
USER=

DBG_CMD=${DEBUG:+echo}

usage()
{
	[[ $# > 0 ]] && echo "$1"
	echo "Использование: $0 [опции] команда"
	echo "Допустимые команды:"
	echo "    install     Устанавливает демон"
	echo "    uninstall   Удаляет демон"
	echo "Допустимые опции:"
	echo "    --autorun             Запускать демона при старте системы"
	echo "    --daemon-name <name>  Имя демона"
	echo "    --directory <dir>     Корневой каталог демона"
	echo "    --port <port>         Номер TCP-порта FCGI-сервера, запускаемого в демоне"
	echo "    --user <user>         Имя пользователя, от имени которого запускается демон"
	echo "    --sandbox <path>      Корневой каталог песочницы (опциональный параметр; если не задан, то песочница не используется)"
	echo "    --configure-nginx <port> <virtual-folder>"
	echo "                          Указывает, что нужно сконфигурировать web-сервер nginx, создав сайт на указаном порту и виртуальном каталоге"
	echo "    --add-opts <opts>     Дополнительные опции"
	echo "    --library <path>      Путь к загружаемой библиотеке (по умолчанию: root_dir/$LIBRARY)"
	echo "    --ep <name>           Точка входа в загружаемую библиотеку (по умолчанию: $ENTRY_POINT)"
	exit 1
}

error()
{
	echo "$1" 1>&2
	exit $2
}

[[ $# > 0 ]] || usage

eval COMMAND=\${$#}

while [ $# -gt 1 ]; do
	case $1 in
		"--autorun")
			AUTORUN=1
			;;
		"--directory")
			shift
			DIRECTORY="$1"
			;;
		"--port")
			shift
			FCGI_PORT="$1"
			;;
		"--add-opts")
			shift
			ADD_OPTS="$1"
			;;
		"--daemon-name")
			shift
			DAEMON_NAME="$1"
			;;
		"--library")
			shift
			LIBRARY="$1"
			;;
		"--ep")
			shift
			ENTRY_POINT="$1"
			;;
		"--user")
			shift
			USER="$1"
			;;
		"--sandbox")
			shift
			SANDBOX_ROOT="$1"
			;;
		"--configure-nginx")
			NGINX_ENABLED=1
			shift
			NGINX_PORT="$1"
			shift
			NGINX_VFOLDER="$1"
			;;
		*)
			usage "ОШИБКА: Встречена неизвестная опция \"$1\""
	esac
	shift
done

if [[ ${LIBRARY:0:1} = "/" ]]; then
	FULL_LIB_PATH="$LIBRARY"
else
	FULL_LIB_PATH="$DIRECTORY/$LIBRARY"
fi

checkDirectory() {
	[ -z $DIRECTORY ] && usage "ОШИБКА: не задан обязательный параметр \"--directory\""
	[ ! -d $DIRECTORY ] && usage "ОШИБКА: указанная директория \"$DIRECTORY\" не существует или не является каталогом"
}

checkTcpPort()
{
	local port=$1
	echo "$port" | egrep -q '^[0-9]{1,5}$' && [[ "$port" -gt 0 ]] && [[ "$port" -le 65535 ]]
}

checkFcgiPort()
{
	[ -z "$FCGI_PORT" ] || checkTcpPort "$FCGI_PORT" || usage "ОШИБКА: задано недопустимое значение порта FCGI-сервера \"$FCGI_PORT\""
}

checkNginxConfig()
{
	if ! [ -z "$NGINX_ENABLED" ]
	then
		[ -z "$NGINX_PORT" ] && usage "ОШИБКА: не задан порт nginx-сервера"
		checkTcpPort "$NGINX_PORT" || usage "ОШИБКА: задано недопустимое значение порта NGINX \"$NGINX_PORT\""
		[ -z "$NGINX_VFOLDER" ] && usage "ОШИБКА: не задан виртуальный каталог сайта"
		[[ "`basename $DIRECTORY`" != "service" ]] && error "Невозможно создать файл конфигурации NGINX: сайт расположен в нестандартном каталоге (должен располагаться в каталоге \"service\")" 2
		local dir="`dirname "$DIRECTORY"`/"
		[[ ${NGINX_VFOLDER:(-1)} == '/' ]] || NGINX_VFOLDER="$NGINX_VFOLDER/"
		[[ "$dir" == *$NGINX_VFOLDER ]] || usage "ОШИБКА: указанный виртуальный каталог \"$NGINX_VFOLDER\" не соответствует указанному пути \"$DIRECTORY\""
		NGINX_SITE_ROOT=${dir%$NGINX_VFOLDER}
   	fi
}

checkUser()
{
	[ -z "$USER" ] && usage "Не задан обязательный параметр \"--user\""
	if [ -z "$SANDBOX_ROOT" ]; then
		getent passwd $USER  > /dev/null || error "User \"$USER\" does not exist" 1
	else
		cat "$SANDBOX_ROOT/etc/passwd" | grep -e "^$USER" > /dev/null || error "Пользователь \"$USER\" не найден в песочнице" 1
	fi
}

checkName()
{
	[ -z "$DAEMON_NAME" ] && usage "Не задан обязательный параметр \"--daemon-name\""
	[[ "$DAEMON_NAME" =~ ^[-0-9a-zA-Zа-яА-Я_\ ]+$ ]] || error "ОШИБКА: указанное имя демона ($DAEMON_NAME) содержит недопустимые символы" 1
}

checkLibPath()
{
	[ -z $LIBRARY ] && usage "Не задан обязательный параметр  \"--library\""
	[ -r "$FULL_LIB_PATH" ] || error "ОШИБКА: указан некорректный путь до библиотеки ($FULL_LIB_PATH)" 1
}

checkEntryPoint()
{
	[ -z $ENTRY_POINT ] && usage "Не задан обязательный параметр \"--ep\""
	if which nm 2>&1 > /dev/null
	then
		{ nm -D --defined-only "$FULL_LIB_PATH" | grep -q "$ENTRY_POINT"; } || \
		{
			error "Точка входа \"$ENTRY_POINT\" не найдена в библиотеке \"$FULL_LIB_PATH\"" 1
		}
	fi
}

checkSandboxRoot()
{
	[[ -n "$SANDBOX_ROOT" && ! -d "$SANDBOX_ROOT" ]] && usage  "Ошибка: указанная директория песочницы \"$SANDBOX_ROOT\" не существует или не является каталогом"
}

if [ -z "$DEBUG" ]; then
	SCRIPT_NAME="/etc/init.d/$DAEMON_NAME"
else
	SCRIPT_NAME="./$DAEMON_NAME"
fi

# For debug.
#SCRIPT_NAME="$DAEMON_NAME"

get_nginx_cfg_filename()
{
	NGINX_CFG_DIR="/etc/nginx/sites/"
	NGINX_CFG_FILE="$NGINX_CFG_DIR$DAEMON_NAME.$NGINX_PORT.manual.conf"
}

generate_nginx_config()
{
	[ -z $NGINX_ENABLED ] && return 0

	get_nginx_cfg_filename
	local SRV_LOCATION="$NGINX_VFOLDER"
	[[ ${SRV_LOCATION:0:1} != / ]] && SRV_LOCATION="/$SRV_LOCATION"
	[[ ${SRV_LOCATION:(-1):1} != / ]] && SRV_LOCATION="$SRV_LOCATION/"
	SRV_LOCATION=${SRV_LOCATION}service
	mkdir -p "$NGINX_CFG_DIR"
	echo \
"server {
    listen       $NGINX_PORT;
    server_name  _;
    access_log   /var/log/nginx/$DAEMON_NAME.access_$NGINX_PORT.log main;

    set \$root    $NGINX_SITE_ROOT;
    root         \$root;

    location =/!root {
            allow 10.0.0.0/8;
            allow 192.168.0.0/16;
            allow 127.0.0.0/8;
            deny all;
            keepalive_timeout 0;
            rewrite_by_lua '
                ngx.header[\"Content-Type\"] = \"text/plain\"
                ngx.say(ngx.var.root)
                ngx.status=ngx.HTTP_OK
                ngx.exit(ngx.HTTP_OK)
            ';
    }

    location $SRV_LOCATION {
        try_files \$uri @bl;
    }

    location / {
        return 499;
    }

    location @bl {
        fastcgi_pass 127.0.0.1:$FCGI_PORT;
        include fastcgi_params;
    }
}" > "$NGINX_CFG_FILE" || error "Не удалось создать файл конфигурации nginx \"$NGINX_CFG_FILE\"" 3
}

generate_init_d_script()
{
	echo -e "#!/bin/bash
#
# $DAEMON_NAME        init file for starting up the sbis daemon
#
# chkconfig:   - 20 80
# description: Starts and stops the sbis daemon.

DAEMON_DIR=\"$DIRECTORY\"
DAEMON_USER=\"$USER\"
DAEMON_LIB=\"$LIBRARY\"
DAEMON_EP=\"$ENTRY_POINT\"
DAEMON_NAME=\"$DAEMON_NAME\"
DAEMON=\"\$DAEMON_DIR/sbis-daemon\"
DAEMON_LOG_DIR=\"/var/log/sbis\"
DAEMON_LOG=\"\$DAEMON_LOG_DIR/$DAEMON_NAME.log\"
ADD_OPTS=\"$ADD_OPTS\"
SANDBOX_ROOT=\"$SANDBOX_ROOT\"

if [ \"\$(id -u)\" != \"0\" ]; then
   echo \"This script must be run as root\" 1>&2
   exit 1
fi

if [ -n \"$SANDBOX_ROOT\" ] && [ -f /etc/sbis-sandbox ]; then
   SANDBOX_ROOT=""
fi

prepare() {
    [ -d \"\$DAEMON_LOG_DIR\" ] || mkdir \"\$DAEMON_LOG_DIR\"

    [ -d \"\$SANDBOX_ROOT/var/run/sbis\" ] || mkdir \"\$SANDBOX_ROOT/var/run/sbis\"
    chmod 777 \"\$SANDBOX_ROOT/var/run/sbis\"

    if [ -n \"\$SANDBOX_ROOT\" ]; then
        [ -d \"\$SANDBOX_ROOT/\$DAEMON_LOG_DIR\" ] || mkdir \"\$SANDBOX_ROOT/\$DAEMON_LOG_DIR\"
        chmod 777 \"\$SANDBOX_ROOT/\$DAEMON_LOG_DIR\"
    fi
}

cd \"\$DAEMON_DIR\" || exit 2;

run_daemon()
{
    prepare
    if [ -n \"\$SANDBOX_ROOT\" ]; then
        local CHROOT_CMD=\"chroot \\\"\$SANDBOX_ROOT\\\"\"
    fi
    chmod +x \"\$DAEMON\"
    local RUN_CMD=\"su -l \\\"\$DAEMON_USER\\\" -c \\\"export LANG=en_US.utf8; ulimit -c unlimited; \\\"\$DAEMON\\\" --name \\\\\\\\\\\"\"\$DAEMON_NAME\"\\\\\\\\\\\" --library \\\"\$DAEMON_LIB\\\" --ep \$DAEMON_EP \$1 \$ADD_OPTS\\\"\"
    eval \"\$CHROOT_CMD \$RUN_CMD\" 2>> \"\$DAEMON_LOG\" && exit 0
}

case \"\$1\" in
    start)
        run_daemon start
        ;;
    stop)
        ADD_OPTS=\"\"
        run_daemon stop
        ;;
    restart)
        run_daemon restart
        ;;
    status)
        ADD_OPTS=\"\"
        run_daemon "status"
        ;;
    *)
        echo $\"Usage: \$0 {start|stop|status|restart}\"
        exit 2
esac
exit \$?" > "$SCRIPT_NAME"
	chmod +x "$SCRIPT_NAME"
}

stop_daemon()
{
	$DBG_CMD service "$DAEMON_NAME" stop
}

reg_in_chkconfig()
{
	$DBG_CMD chkconfig --add "$DAEMON_NAME"
	if [[ $? && -n $AUTORUN ]]; then
		$DBG_CMD chkconfig "$DAEMON_NAME" on
	else
		$DBG_CMD chkconfig "$DAEMON_NAME" off
	fi
}

delete_init_d_script()
{
	rm -vf "$SCRIPT_NAME"
}

unreg_from_chkconfig()
{
	$DBG_CMD chkconfig --del "$DAEMON_NAME"
}

remove_nginx_cfg()
{
	if ! [ -z $NGINX_PORT ]
	then
		get_nginx_cfg_filename
		! [ -f "$NGINX_CFG_FILE" ] || rm -vf "$NGINX_CFG_FILE"
	fi
	return 0
}

case $COMMAND in
	install)
		checkSandboxRoot
		checkName
		checkFcgiPort
		checkDirectory
		checkUser
		checkLibPath
		checkEntryPoint
		checkNginxConfig
		
		[ ! -z "$FCGI_PORT" ] && ADD_OPTS="$ADD_OPTS --port :$FCGI_PORT"
		
		echo "====================================="
		echo "Registering daemon \"$DAEMON_NAME\""
		echo "-------------------------------------"
		echo "directory:   $DIRECTORY"
		echo "user:        $USER"
		[ -n "$FCGI_PORT" ] && echo "port:        $FCGI_PORT"
		echo "library:     $LIBRARY"
		echo "entry point: $ENTRY_POINT"
		
		if [[ -n "$AUTORUN" ]]; then
		    echo "autorun:     true"
		else
		    echo "autorun:     false"
		fi
		
		if [[ -n "$SANDBOX_ROOT" ]]; then
		    echo "sandbox root: $SANDBOX_ROOT"
		fi

		if ! [[ -z "$NGINX_ENABLED" ]]; then
			echo "nginx port:  $NGINX_PORT"
			echo "site root:   $NGINX_SITE_ROOT"
			echo "virtual folder: $NGINX_VFOLDER"
		fi
		
		echo "====================================="
		generate_init_d_script && reg_in_chkconfig && generate_nginx_config && echo "OK"
		;;
	uninstall)
		checkName
		echo "====================================="
		echo "unregistering daemon \"$DAEMON_NAME\""
		echo "====================================="
		stop_daemon
		unreg_from_chkconfig && delete_init_d_script && remove_nginx_cfg && echo "OK"
		;;
	*)
		usage "ОШИБКА: Неизвестная команда \"$COMMAND\""
esac

true

