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
PORT=
USER=

DBG_CMD=${DEBUG:+echo}

usage()
{
    echo "Usage: $0 [OPTIONS] command"
    echo "Allowed commands:"
    echo -e "\tinstall     Installs the daemon"
    echo -e "\tuninstall   Uninstalls the daemon"
    echo "Allowed options:"
    echo -e "\t--autorun             Start daemon at startup"
    echo -e "\t--daemon-name <name>  The daemon name"
    echo -e "\t--directory <dir>     The root directory of the daemon"
    echo -e "\t--add-opts <opts>     Additional options, will be passed to entry point function"
#    echo -e "\t--ep <name>           Entry point name of the library (default: $ENTRY_POINT)"
#    echo -e "\t--library <path>      The path to the library, which will be runned (default: root_dir/$LIBRARY)"
    echo -e "\t--port <port>         The daemon port"
    echo -e "\t--user <user>         Assume identity of <user>"
    exit 1
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
            PORT="$1"
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
    esac
    shift
done

checkDirectory() {
    if [ -z $DIRECTORY ]; then
        echo "Required option \"--directory\" was not specified" 1>&2
        usage
    fi
    if [ ! -d $DIRECTORY ]; then
        echo "Error: specified directory \"$DIRECTORY\" does not exist" 1>&2
        exit 1
    fi
}

checkPort() {
    if [ -z $PORT ]; then
#        echo "Required option \"--port\" was not specified" 1>&2
#        usage
        return
    fi
    if [[ ! $PORT =~ ^:?[[:digit:]]{1,5}$ ]]; then
        echo "Error: invalid port format ($PORT)" 1>&2
        exit 1
    fi
}

checkUser() {
    if [ -z $USER ]; then
        echo "Required option \"--user\" was not specified" 1>&2
        usage
    fi
    if ! getent passwd $USER  > /dev/null; then
        echo "User \"$USER\" does not exist" 1>&2
        exit 1
    fi
}

checkName() {
    if [ -z $DAEMON_NAME ]; then
        echo "Required option \"--daemon-name\" was not specified" 1>&2
        usage
    fi
    if [[ ! $DAEMON_NAME =~ ^[0-9a-zA-Z_]+$ ]]; then
        echo "Error: invalid daemon name format ($DAEMON_NAME)" 1>&2
        exit 1
    fi
}

checkLibPath() {
    if [ -z $LIBRARY ]; then
        echo "Required option \"--library\" was not specified" 1>&2
        usage
    fi
    if [ ! -r "$DIRECTORY/$LIBRARY" ]; then
        echo "Error: invalid library path ($LIBRARY)" 1>&2
        exit 1
    fi
}

checkEntryPoint() {
    if [ -z $ENTRY_POINT ]; then
        echo "Required option \"--ep\" was not specified" 1>&2
        usage
    fi

   if which nm 2>&1 > /dev/null; then
      { nm --defined-only "$DIRECTORY/$LIBRARY" |grep -q "$ENTRY_POINT"; } || \
      {
         echo "Entry point \"$ENTRY_POINT\" was not found in the library \"$DIRECTORY/$LIBRARY\"" 1>&2
         usage
      }
   fi
}

if [ -z "$DEBUG" ]; then
    SCRIPT_NAME="/etc/init.d/$DAEMON_NAME"
else
    SCRIPT_NAME="./$DAEMON_NAME"
fi

# For debug.
#SCRIPT_NAME="$DAEMON_NAME"

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
DAEMON_LOG=\"/var/log/sbis/$DAEMON_NAME.log\"

if [ \"\$(id -u)\" != \"0\" ]; then
   echo \"This script must be run as root\" 1>&2
   exit 1
fi

prepare() {
    [ -d /var/log/sbis ] || mkdir /var/log/sbis
    chown \$DAEMON_USER.\$DAEMON_USER /var/log/sbis
    [ -d /var/run/sbis ] || mkdir /var/run/sbis
    chown \$DAEMON_USER.\$DAEMON_USER /var/run/sbis
}

cd \"\$DAEMON_DIR\" || exit 2;

run_daemon()
{
    prepare
    su -l \"\$DAEMON_USER\" -c \"\$DAEMON --name \$DAEMON_NAME --library \$DAEMON_LIB --ep \$DAEMON_EP \$1 $ADD_OPTS\" 2>> \"\$DAEMON_LOG\" && exit 0
}

case \"\$1\" in
    start)
        run_daemon "start"
        ;;
    stop)
        run_daemon "stop"
        ;;
    restart)
        run_daemon "restart"
        ;;
    status)
        run_daemon "status"
        ;;
    *)
        echo $\"Usage: \$0 {start|stop|status|restart}\"
        exit 2
esac
exit \$?" > "$SCRIPT_NAME"
    chmod +x "$SCRIPT_NAME"
}

stop_daemon() {
    $DBG_CMD service "$DAEMON_NAME" stop
}

reg_in_chkconfig() {
    $DBG_CMD chkconfig --add "$DAEMON_NAME"
    if [[ $? && -n $AUTORUN ]]; then
        $DBG_CMD chkconfig "$DAEMON_NAME" on
    else
        $DBG_CMD chkconfig "$DAEMON_NAME" off
    fi
}

delete_init_d_script() {
    rm -vf "$SCRIPT_NAME"
}

unreg_from_chkconfig() {
    $DBG_CMD chkconfig --del "$DAEMON_NAME"
}

case $COMMAND in
    install)
        checkName       && \
        checkPort       && \
        checkDirectory  && \
        checkUser       && \
        checkLibPath    && \
        checkEntryPoint

        [ ! -z "$PORT" ] && ADD_OPTS="$ADD_OPTS --port $PORT"

        echo "====================================="
        echo "Registering daemon \"$DAEMON_NAME\""
        echo "-------------------------------------"
        echo "directory:   $DIRECTORY"
        echo "user:        $USER"
        echo "port:        $PORT"
        echo "library:     $LIBRARY"
        echo "entry point: $ENTRY_POINT"

        if [[ -n $AUTORUN ]]; then
            echo "autorun:     true"
        else
            echo "autorun:     false"
        fi

        echo "====================================="
        generate_init_d_script && reg_in_chkconfig && echo "OK"
        ;;
    uninstall)
        checkName
        echo "====================================="
        echo "unregistering daemon \"$DAEMON_NAME\""
        echo "====================================="
        stop_daemon
        unreg_from_chkconfig && delete_init_d_script && echo "OK"
        ;;
    *)
        echo "unknown command \"$COMMAND\"" 1>&2
        usage
esac
exit 0

