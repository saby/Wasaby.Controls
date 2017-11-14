#!groovy
echo "Задаем параметры сборки"
def version = "3.17.210"
node(){
    def props = readProperties file: "/home/jenkins/shared_autotest87/settings_210.props"
    settingsJob.add(string(name: "props", value: props))
}
properties([
    disableConcurrentBuilds(),
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '3',
            artifactNumToKeepStr: '3',
            daysToKeepStr: '3',
            numToKeepStr: '3')),
    parameters([
        string(
            defaultValue: 'sdk',
            description: '',
            name: 'ws_revision'),
        string(
            defaultValue: 'sdk',
            description: '',
            name: 'ws_data_revision'),
        string(
            defaultValue: 'rc-3.17.210',
            description: '',
            name: 'branch_engine'),
        string(
            defaultValue: env.props["atf_co"],
            description: '',
            name: 'branch_atf'),
        choice(
            choices: "online\npresto\ncarry\ngenie",
            description: '',
            name: 'theme'),
        choice(choices: "chrome\nff", description: '', name: 'browser_type'),
        booleanParam(defaultValue: false, description: "Запуск тестов верстки", name: 'run_reg'),
        booleanParam(defaultValue: false, description: "Запуск интеграционных тестов", name: 'run_int'),
        booleanParam(defaultValue: false, description: "Запуск unit тестов", name: 'run_unit'),
        booleanParam(defaultValue: false, description: "Запуск только упавших тестов из предыдущего билда", name: 'RUN_ONLY_FAIL_TEST')
        ]),
    pipelineTriggers([])
])
if ( "${env.BUILD_NUMBER}" != "1" && !params.run_reg && !params.run_int && !params.run_unit) {
        currentBuild.result = 'ABORTED'
        error('Ветка запустилась по пушу, либо запуск с некоректными параметрами')
    }

node('controls') {
    echo "Назначем версию и определяем рабочую директорию"
    
    def workspace = "/home/sbis/workspace/controls_${version}/${BRANCH_NAME}"
    ws(workspace) {
        echo "Чистим рабочую директорию"
        deleteDir()
        echo "Назначаем переменную"
        def server_address=props["SERVER_ADDRESS"]
        def ver = version.replaceAll('.','')
        def python_ver = 'python3'
        def SDK = ""
        def items = "controls:${workspace}/controls"
        def branch_atf = params.branch_atf
        def branch_engine = params.branch_engine
        def inte = params.run_int
        def regr = params.run_reg
        def unit = params.run_unit
        if ("${env.BUILD_NUMBER}" == "1"){
            inte = true
            regr = true
            unit = true
        }
        echo "Выкачиваем хранилища"
        stage("Checkout"){
            parallel (
                checkout1: {
                    echo "Выкачиваем controls "
                    dir(workspace) {
                        checkout([$class: 'GitSCM',
                        branches: [[name: env.BRANCH_NAME]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'RelativeTargetDirectory',
                            relativeTargetDir: "controls"
                            ]],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:sbis/controls.git']]
                        ])
                    }
                    echo "Обновляемся из rc-"
                    dir("./controls"){
                        sh """
                        git fetch
                        git merge origin/rc-${version}
                        """
                    }
                    parallel (
                        checkout_atf:{
                            echo " Выкачиваем atf"
                            dir("./controls/tests/int") {
                            checkout([$class: 'GitSCM',
                                branches: [[name: branch_atf]],
                                doGenerateSubmoduleConfigurations: false,
                                extensions: [[
                                    $class: 'RelativeTargetDirectory',
                                    relativeTargetDir: "atf"
                                    ]],
                                    submoduleCfg: [],
                                    userRemoteConfigs: [[
                                        credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                        url: 'git@git.sbis.ru:autotests/atf.git']]
                                ])
                            }
                        },
                        checkout_engine: {
                            echo " Выкачиваем engine"
                            dir("./controls/tests"){
                                checkout([$class: 'GitSCM',
                                branches: [[name: branch_engine]],
                                doGenerateSubmoduleConfigurations: false,
                                extensions: [[
                                    $class: 'RelativeTargetDirectory',
                                    relativeTargetDir: "sbis3-app-engine"
                                    ]],
                                    submoduleCfg: [],
                                    userRemoteConfigs: [[
                                        credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                        url: 'git@git.sbis.ru:sbis/engine.git']]
                                ])
                            }
                        }
                    )
                },
                checkout2: {
                    echo " Выкачиваем сборочные скрипты"
                    dir(workspace) {
                        checkout([$class: 'GitSCM',
                        branches: [[name: "rc-${version}"]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'RelativeTargetDirectory',
                            relativeTargetDir: "constructor"
                            ]],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:sbis-ci/platform.git']]
                        ])
                    }
                    dir("./constructor") {
                        checkout([$class: 'GitSCM',
                        branches: [[name: "rc-${version}"]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'RelativeTargetDirectory',
                            relativeTargetDir: "Constructor"
                            ]],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:sbis-ci/constructor.git']]
                        ])
                    }
                },
                checkout3: {
                    dir(workspace) {
                        echo "Выкачиваем cdn"
                        checkout([$class: 'GitSCM',
                        branches: [[name: '1.0']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'RelativeTargetDirectory',
                            relativeTargetDir: "cdn"
                            ]],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:root/sbis3-cdn.git']]
                        ])
                    }
                },
                checkout4: {
                    echo "Выкачиваем demo_stand"
                    dir(workspace) {
                        checkout([$class: 'GitSCM',
                        branches: [[name: 'master']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'RelativeTargetDirectory',
                            relativeTargetDir: "demo_stand"
                            ]],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:ka.sannikov/demo_stand.git']]
                        ])
                    }
                }
            )
        }
        stage("Сборка компонент"){
            echo " Определяем SDK"
            dir("./constructor/Constructor/SDK") {
                SDK = sh returnStdout: true, script: "${python_ver} getSDK.py ${version} --conf linux_x86_64 -b"
                SDK = SDK.trim()
                echo SDK
            }
            echo " Копируем /demo_stand/client в /tests/stand/client"
            sh "cp -rf ./demo_stand/client ./controls/tests/stand"
            parallel(
                ws: {
                    echo "Выкачиваем ws для unit тестов и если указан сторонний бранч"
                    if ( unit || "${params.ws_revision}" != "sdk" ){
                        def ws_revision = params.ws_revision
                        if ("${params.ws_revision}" == "sdk" ){
                            ws_revision = sh returnStdout: true, script: "${python_ver} ${workspace}/constructor/read_meta.py -rev ${SDK}/meta.info ws"
                        }
                        dir(workspace) {
                            checkout([$class: 'GitSCM',
                            branches: [[name: ws_revision]],
                            doGenerateSubmoduleConfigurations: false,
                            extensions: [[
                                $class: 'RelativeTargetDirectory',
                                relativeTargetDir: "WIS-git-temp"
                                ]],
                                submoduleCfg: [],
                                userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:sbis/ws.git']]
                            ])
                        }
                    }
                },
                ws_data: {
                    echo "Выкачиваем ws.data для unit тестов и если указан сторонний бранч"
                    if ( unit || "${params.ws_data_revision}" != "sdk" ){
                        def ws_data_revision = params.ws_data_revision
                        if ( "${params.ws_data_revision}" == "sdk" ){
                            ws_data_revision = sh returnStdout: true, script: "${python_ver} ${workspace}/constructor/read_meta.py -rev ${SDK}/meta.info ws_data"
                        }
                        dir(workspace) {
                            checkout([$class: 'GitSCM',
                            branches: [[name: ws_data_revision]],
                            doGenerateSubmoduleConfigurations: false,
                            extensions: [[
                                $class: 'RelativeTargetDirectory',
                                relativeTargetDir: "ws_data"
                                ]],
                                submoduleCfg: [],
                                userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:ws/data.git']]
                            ])
                        }
                    }
                }
            )
            echo "Собираем controls"
            dir("./controls"){
                sh "${python_ver} ${workspace}/constructor/build_controls.py ${workspace}/controls ${env.BUILD_NUMBER} --not_web_sdk NOT_WEB_SDK"
            }
            dir(workspace){
                echo "Собираем ws если задан сторонний бранч"
                if ("${params.ws_revision}" != "sdk"){
                    sh "rm -rf ${workspace}/WIS-git-temp2"
                    sh "mkdir ${workspace}/WIS-git-temp2"
                    sh "${python_ver} ${workspace}/constructor/build_ws.py ${workspace}/WIS-git-temp 'release' ${workspace}/WIS-git-temp2 ${env.BUILD_NUMBER} --not_web_sdk NOT_WEB_SDK"
                    echo "Добавляем в items"
                    items = items + ", ws:${workspace}/WIS-git-temp2"
                }
                echo "Собираем ws.data только когда указан сторонний бранч"
                if ("${params.ws_data_revision}" != "sdk"){
                    echo "Добавляем в items"
                    items = items + ", ws_data:${workspace}/ws_data"
                }
            }
            echo items
        }
        stage("Unit тесты"){
            if ( unit ){
                echo "Запускаем юнит тесты"
                dir(workspace){
                    sh "cp -rf ./WIS-git-temp ./controls/sbis3-ws"
                    sh "cp -rf ./ws_data/WS.Data ./controls/components/"
                    sh "cp -rf ./ws_data/WS.Data ./controls/"
                }
                dir("./controls"){
                    sh "npm config set registry http://npmregistry.sbis.ru:81/"
                    parallel (
                        isolated: {
                            sh "sh ./bin/test-isolated"
                            sh "mv ./artifacts/xunit-report.xml ./artifacts/test-isolated-report.xml"
                        },
                        browser: {
                            sh """
                            export test_url_host=${env.NODE_NAME}
                            export test_server_port=10253
                            export test_url_port=10253
                            export WEBDRIVER_remote_enabled=1
                            export WEBDRIVER_remote_host=10.76.163.98
                            export WEBDRIVER_remote_port=4380
                            export test_report=artifacts/test-browser-report.xml
                            sh ./bin/test-browser"""
                        }
                    )
                }
            }
        }
        stage("Разворот стенда"){
            echo "Запускаем разворот стенда и подготавливаем окружение для тестов"
            // Создаем sbis-rpc-service.ini
            def host_db = "test-autotest-db1"
            def port_db = "5432"
            def name_db = "css_${env.NODE_NAME}${ver}1"
            def user_db = "postgres"
            def password_db = "postgres"
            writeFile file: "./controls/tests/stand/conf/sbis-rpc-service.ini", text: """[Базовая конфигурация]
                АдресСервиса=${env.NODE_NAME}:10001
                ПаузаПередЗагрузкойМодулей=0
                ХранилищеСессий=host=\'dev-sbis3-autotest\' port=\'6380\' dbindex=\'2\'
                БазаДанных=postgresql: host=\'${host_db}\' port=\'${port_db}\' dbname=\'${name_db}\' user=\'${user_db}\' password=\'${password_db}\'
                РазмерКэшаСессий=3
                Конфигурация=ini-файл
                [Ядро.Сервер приложений]
                ПосылатьОтказВОбслуживанииПриОтсутствииРабочихПроцессов=Нет
                МаксимальноеВремяЗапросаВОчереди=60000
                ЧислоРабочихПроцессов=4
                [Ядро.Права]
                Проверять=Нет
                [Ядро.Асинхронные сообщения]
                БрокерыОбмена=amqp://test-rabbitmq.unix.tensor.ru
                [Ядро.Логирование]
                Уровень=Параноидальный
                ОграничениеДляВходящегоВызова=1024
                ОграничениеДляИсходящегоВызова=1024
                ОтправлятьНаСервисЛогов=Нет
                [Тест]
                Адрес=http://${env.NODE_NAME}:10001"""
            // Копируем шаблоны
            sh """cp -f ./controls/tests/stand/intest/pageTemplates/branch/* ./controls/tests/stand/intest/pageTemplates"""
            sh """
                cd "${workspace}/controls/tests/stand/intest/"
                sudo python3 "change_theme.py" ${params.theme}
                cd "${workspace}"
            """
            sh """
                sudo chmod -R 0777 ${workspace}
                ${python_ver} "./constructor/updater.py" "${version}" "/home/sbis/Controls1" "css_${env.NODE_NAME}${ver}1" "./controls/tests/stand/conf/sbis-rpc-service.ini" "./controls/tests/stand/distrib_branch_new" --sdk_path "${SDK}" --items "${items}" --host test-autotest-db1 --stand nginx_branch --daemon_name Controls1
                sudo chmod -R 0777 ${workspace}
                sudo chmod -R 0777 /home/sbis/Controls1
            """
            //Пакуем данные
            writeFile file: "/home/sbis/Controls1/Core.package.json", text: """
                {
                "includeCore":true,
                "include":[
                "Core/*",
                "WS.Data/*",
                "SBIS3.CONTROLS.ItemsControlMixin"
                ],
                "modules" : [
                "Core/core",
                "WS.Data/Source/SbisService",
                "WS.Data/Source/Memory",
                "WS.Data/Entity/Model",
                "WS.Data/Collection/RecordSet",
                "SBIS3.CONTROLS.ItemsControlMixin"
                ],
                    "output" : "/resources/Core.module.js"
                }"""
            sh """
                cd ./jinnee/distrib/builder
                node ./node_modules/grunt-cli/bin/grunt custompack --root=/home/sbis/Controls1 --application=/
            """
        }
        writeFile file: "./controls/tests/int/config.ini", text:
            """# UTF-8
            [general]
            browser = ${params.browser_type}
            SITE = http://${NODE_NAME}:30001
            fail_test_repeat_times = 0
            DO_NOT_RESTART = True
            SOFT_RESTART = True
            NO_RESOURCES = True
            STREAMS_NUMBER = 15
            DELAY_RUN_TESTS = 1
            TAGS_NOT_TO_START = iOSOnly
            ELEMENT_OUTPUT_LOG = locator
            WAIT_ELEMENT_LOAD = 20
            HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${BRANCH_NAME}/controls/tests/int/
            SERVER = test-autotest-db1
            BASE_VERSION = css_${NODE_NAME}${ver}1
            server_address = ${server_address}}"""
        if ( "${params.theme}" != "online" ) {
            writeFile file: "./controls/tests/reg/config.ini",
            text:
                """# UTF-8
                [general]
                browser = ${params.browser_type}
                SITE = http://${NODE_NAME}:30001
                fail_test_repeat_times = 0
                DO_NOT_RESTART = True
                SOFT_RESTART = False
                NO_RESOURCES = True
                STREAMS_NUMBER = 15
                DELAY_RUN_TESTS = 1
                TAGS_TO_START = ${params.theme}
                ELEMENT_OUTPUT_LOG = locator
                WAIT_ELEMENT_LOAD = 20
                HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${BRANCH_NAME}/controls/tests/reg/
                SERVER = test-autotest-db1
                BASE_VERSION = css_${NODE_NAME}${ver}1
                server_address = http://10.76.159.209:4444/wd/hub
                CHROME_BINARY_LOCATION=C:\\chrome64_58\\chrome.exe
                [regression]
                IMAGE_DIR = capture_${params.theme}
                RUN_REGRESSION=True"""
        } else {
            writeFile file: "./controls/tests/reg/config.ini",
            text:
                """# UTF-8
                [general]
                browser = ${params.browser_type}
                SITE = http://${NODE_NAME}:30001
                fail_test_repeat_times = 0
                DO_NOT_RESTART = True
                SOFT_RESTART = False
                NO_RESOURCES = True
                STREAMS_NUMBER = 15
                DELAY_RUN_TESTS = 2
                TAGS_TO_START = ${params.theme}
                ELEMENT_OUTPUT_LOG = locator
                WAIT_ELEMENT_LOAD = 20
                HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${BRANCH_NAME}/controls/tests/reg/
                SERVER = test-autotest-db1
                BASE_VERSION = css_${NODE_NAME}${ver}1
                server_address = http://10.76.159.209:4444/wd/hub
                CHROME_BINARY_LOCATION=C:\\chrome64_58\\chrome.exe
                [regression]
                IMAGE_DIR = capture
                RUN_REGRESSION=True"""
        }
        def run_test_fail = ""
        if (params.RUN_ONLY_FAIL_TEST == true){
            run_test_fail = "-sf"
            step([$class: 'CopyArtifact', fingerprintArtifacts: true, projectName: "${env.JOB_NAME}", selector: [$class: 'LastCompletedBuildSelector']])
        }
        stage("Запуск тестов интеграционных и верстки"){
            parallel (
                int_test: {
                    echo "Запускаем интеграционные тесты"
                    stage("Инт.тесты"){
                        if ( inte ){
                            def site = "http://${NODE_NAME}:30001"
                            site.trim()
                            dir("./controls/tests/int"){
                                 sh """
                                 source /home/sbis/venv_for_test/bin/activate
                                 python start_tests.py --RESTART_AFTER_BUILD_MODE ${run_test_fail}
                                 deactivate
                                 """
                            }
                        }
                    }
                },
                reg_test: {
                    stage("Рег.тесты"){
                        echo "Запускаем тесты верстки"
                        if ( regr ){
                            sh "cp -R ./controls/tests/int/atf/ ./controls/tests/reg/atf/"
                            dir("./controls/tests/reg"){
                                sh """
                                    source /home/sbis/venv_for_test/bin/activate
                                    python start_tests.py --RESTART_AFTER_BUILD_MODE ${run_test_fail}
                                    deactivate
                                """
                            }
                        }
                    }
                }
            )
        }
        sh """
            sudo chmod -R 0777 ${workspace}
            sudo chmod -R 0777 /home/sbis/Controls1
        """
        stage("Результаты"){
            echo "выкладываем результаты в зависимости от включенных тестов 'all only_reg only_int only_unit'"
            if ( regr ){
                dir(workspace){
                    publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: false, reportDir: './controls/tests/reg/capture_report/', reportFiles: 'report.html', reportName: 'Regression Report', reportTitles: ''])
                }
                archiveArtifacts allowEmptyArchive: true, artifacts: '**/report.zip', caseSensitive: false
            }
            if ( unit ){
                junit keepLongStdio: true, testResults: "**/artifacts/*.xml"
            }
            if ( regr || inte ){
                archiveArtifacts allowEmptyArchive: true, artifacts: '**/result.db', caseSensitive: false
                junit keepLongStdio: true, testResults: "**/test-reports/*.xml"
            }
        }
    }
}
