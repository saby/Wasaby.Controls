chcp 1251

set VERSION=%~1
set SBIS3_number=%~2
set VER=%VERSION:~0,1%%VERSION:~2,1%%VERSION:~4,1%%VERSION:~6,1%
set INTEST_ROOT=C:\inetpub\InTestControls%VER%
set SITE_ROOT=%INTEST_ROOT%
set BOOST_DIR=C:\Program Files\Boost_1_53
set WORK_DIR_TRUNK=\\test-osr-source\d$\Платформа\%PLATFORM_version%\%SBIS3_number%
set MODULES_FROM=%WORK_DIR%\www\service\Модули
set MODULES_TO=%INTEST_ROOT%\service\Модули
set JINNEE_TO=%WORKSPACE%\jinnee

@echo --------------------------------------
@echo Определяем параметры соединения с СУБД PostgreSQL
@echo --------------------------------------
SET host=sbis-dev6
SET port=5432
SET dbname=css_%VER%
SET username=postgres
SET password=postgres
SET PGPASSWORD=postgres


@echo --------------------------------------
@echo Копирование DLL платформы СБИС 3.0
@echo --------------------------------------
set DLL=sbis-python300.dll sbis-lib300.dll sbis-loader300.dll sbis-redis-client300.dll sbis-rpc300.dll sbis-rpc-service300.dll sbis-rpc-worker300.exe ^
sbis-xerces300.dll sbis-xml300.dll sbis-communication300.dll sbis-rpc-client300.dll sbis-log-sender300.dll rabbitmq.dll sbis-resources300.dll ^
boost_python-vc100-mt-1_53.dll boost_thread-vc100-mt-1_53.dll boost_system-vc100-mt-1_53.dll icudt51.dll icuuc51.dll sbis-lang300.dll sbis-berkeley300.dll

robocopy "%WORK_DIR%\test\sbis" "%INTEST_ROOT%\service" %DLL% /mt 
robocopy "%WORK_DIR%\test\sbis\Модули\i18n"	"%INTEST_ROOT%\service" sbis-lang300.dll 

@echo --------------------------------------
@echo Копируем модули
@echo --------------------------------------
@set counter=0
:prev
set flag=true

set MODULES_FROM_PATH=www\service\Модули
set SOURCE_FOR_COPY=c:\inetpub\tests\css_tmp\%SBIS3_number%
set COPY_MODULS="ws" "%MODULES_FROM_PATH%\Бизнес-логика" "%MODULES_FROM_PATH%\Работа с БД" "%MODULES_FROM_PATH%\Python" "%MODULES_FROM_PATH%\Python Core" "%MODULES_FROM_PATH%\Логирование" "www\service\sbis_root" "%MODULES_FROM_PATH%\Пользовательские настройки" "%MODULES_FROM_PATH%\Пользователь"
@if not exist "%SOURCE_FOR_COPY%" ( 
	md "%SOURCE_FOR_COPY%" 
	@echo ---- создали папку %SOURCE_FOR_COPY%
)
"C:\Program Files\7-Zip\7z.exe" x "%WORK_DIR_TRUNK%\Platforma.7z" %COPY_MODULS% -o"%SOURCE_FOR_COPY%" -y >%SOURCE_FOR_COPY%\log.log
@if %errorlevel% NEQ 0 (
	@echo -------- Ошибка извлечения из архива!
	exit /b 1
)

set MODULES_FROM=%SOURCE_FOR_COPY%\www\service\Модули
set MODULES_FROM_CLIENT=%SOURCE_FOR_COPY%\client
@echo Копируем Модуль - Бизнес-логика
robocopy "%MODULES_FROM%\Бизнес-логика" "%MODULES_TO%\Бизнес-логика" /E /MT /PURGE /LOG:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)
@echo Копируем Модуль - Работа с БД
robocopy "%MODULES_FROM%\Работа с БД" "%MODULES_TO%\Работа с БД" /E /MT /PURGE /LOG+:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)
@echo Копируем Модуль - Python
robocopy "%MODULES_FROM%\Python" "%MODULES_TO%\Python" /E /MT /PURGE /LOG+:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)
@echo Копируем Модуль - Python Core
robocopy "%MODULES_FROM%\Python Core" "%MODULES_TO%\Python Core" /E /MT /PURGE /LOG+:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)
@echo Копируем Модуль - Логирование
robocopy "%MODULES_FROM%\Логирование" "%MODULES_TO%\Логирование" /E /MT /PURGE /LOG+:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)
@echo Копируем Модуль - Пользовательские настройки
robocopy "%MODULES_FROM%\Пользовательские настройки" "%MODULES_TO%\Пользовательские настройки" /E /MT /PURGE /LOG+:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)
@echo Копируем Модуль - Пользователь
robocopy "%MODULES_FROM%\Пользователь" "%MODULES_TO%\Пользователь" /E /MT /PURGE /LOG+:"%WORKSPACE%\LOGS\copy_moduls_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)

rd /s /q "%INTEST_ROOT%\ws"
robocopy "%SOURCE_FOR_COPY%\ws" "%INTEST_ROOT%\ws" /E /MT /PURGE /LOG:"%WORKSPACE%\LOGS\copy_ws_%VERSION%.log"
@if errorlevel 4 (
	@echo "Возникли проблемы при копировании модулей"
	exit /b 1
)

@echo --------------------------------------
@echo Копируем и извлекаем Jinnee из архива
@echo --------------------------------------
@echo Удаляем Jinnee
@time /t
@if not exist "%WORKSPACE%\1" (
	md "%WORKSPACE%\"
)
robocopy "1" "%JINNEE_TO%" /NP /E /MT /PURGE /LOG:"%WORKSPACE%\LOGS\delete_jinnee_%VERSION%.log"
@if exist "%JINNEE_TO%" (
	rd /s /q "%JINNEE_TO%"
)
del jinnee.zip
@time /t
@echo Копируем Jinnee
xcopy "%FINAL_DIR%\jinnee.zip" "%WORKSPACE%\*.*" /y
@if errorlevel 1 (
	@echo "Возникли проблемы при копировании jinnee"
	exit /b 1
)
@time /t
@echo Извлекаем из архива
@"C:\Program Files\7-Zip\7z" x "%WORKSPACE%\jinnee.zip" -o"%WORKSPACE%" -y >"%WORKSPACE%\extract_jinnee.log"
@if errorlevel 1 (
	@echo "Возникли проблемы извлечения из архива"
	echo int_test 1 >>%WORK_DIR%\testing.txt
	exit /b 1
)
@time /t
@echo --------------------------------------
@echo Генерация файла проекта
@echo --------------------------------------
pushd "%WORK_DIR%\script"
py.exe -3 CreateSimpleCloud.py -i "%MODULES_TO%" -o "%MODULES_TO%\Тест.s3cld" --global-parameters "0" --host "%host%" --port "%port%" --dbname "%dbname%" --username "%username%" --password "%password%" --resources-root "/resources/" --ws-root "/ws/" --site-root "%SITE_ROOT%" --start-window-module "intest" --start-window "./index.xaml" "Бизнес-логика" "Работа с БД" "ИнТест" "Python" "Python Core" "Логирование" "intest" "Тема Скрепка" "Пользовательские настройки" "Пользователь" "SBIS3.ENGINE" "SBIS3.CONTROLS"
popd

@time /t
@echo --------------------------------------
@echo Удаляем старую БД
@echo --------------------------------------
SET sqlDropDB="DROP DATABASE IF EXISTS \"%dbname%\""
SET sqlUserSession="SELECT pg_terminate_backend(procpid) FROM pg_stat_activity WHERE datname = '%dbname%' AND procpid <> pg_backend_pid()"
pushd "C:\Program Files\PostgreSQL\9.1\bin"
psql --host=%host% --port=%port% --username=%username% --command=%sqlDropDB%
@if %errorlevel% GTR 0 ( 
	psql --host=%host% --port=%port% --username=%username% --command=%sqlUserSession% --dbname=%dbname% 
	psql --host=%host% --port=%port% --username=%username% --command=%sqlDROPDB%
)
if %errorlevel% GTR 0 @echo ---- Не удалось удалить старую БД! ---- & exit /b 1
popd

@echo --------------------------------------
@echo Разворачиваем базу данных
@echo --------------------------------------
pushd "%JINNEE_TO%"
jinnee.exe /project="%MODULES_TO%\Тест.s3cld" /deploy_db="%MODULES_TO%\Тест.dbschema" /logs_dir="%MODULES_TO%\logs" 
@if not %errorlevel%==0 (
	@echo "Возникли проблемы при разворачивании базы"
	exit /b 1
)
popd

@echo --------------------------------------
@echo Запуск сайта и пула в IIS
@echo --------------------------------------
%windir%\system32\inetsrv\appcmd start apppool InTestControls%VER%
%windir%\system32\inetsrv\appcmd start site InTestControls%VER%


@echo --------------------------------------
@echo Конвертируем ресурсы интерфейса
@echo --------------------------------------
pushd "%JINNEE_TO%"
jinnee.exe /project="%MODULES_TO%\Тест.s3cld" /deploy_resources="%MODULES_TO%\Тест.rsschema" /logs_dir="%MODULES_TO%\logs" 
@if not %errorlevel%==0 (
	@echo "Возникли проблемы при конвертации ресурсов"
	exit /b 1
)
popd