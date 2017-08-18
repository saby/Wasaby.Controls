#!groovy
properties([
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '5',
            artifactNumToKeepStr: '10',
            daysToKeepStr: '5',
            numToKeepStr: '10')),
    parameters([
        string(
            defaultValue: '3.17.100',
            description: 'Версия',
            name: 'version'),
        string(
            defaultValue: 'rc-3.17.100',
            description: '',
            name: 'branch_engine'),
        string(
            defaultValue: 'sdk',
            description: '',
            name: 'ws_revision'),
        string(
            defaultValue: 'sdk',
            description: '',
            name: 'ws_data_revision'),
        string(
            defaultValue: 'rc-3.31',
            description: '',
            name: 'branch_atf'),
        choice(
            choices: "\nfieldlink\nfilterbutton\natplace\nformcontroller\nglobalpanel\nrichedit\nmove\nscroll\nsearch\nprint\nmerge",
            description: '',
            name: 'Tag1'),
        choice(
            choices: "\nfieldlink\nfilterbutton\natplace\nformcontroller\nglobalpanel\nrichedit\nmove\nscroll\nsearch\nprint\nmerge",
            description: '',
            name: 'Tag2'),
        choice(
            choices: "\nfieldlink\nfilterbutton\natplace\nformcontroller\nglobalpanel\nrichedit\nmove\nscroll\nsearch\nprint\nmerge",
            description: '',
            name: 'Tag3'),
        choice(
            choices: "online\npresto\ncarry\ngenie",
            description: '',
            name: 'theme'),
        choice(choices: "chrome\nff", description: '', name: 'browser_type'),
        choice(choices: "all\nonly_reg\nonly_int\nonly_unit", description: '', name: 'run_tests')]),
    pipelineTriggers([])
])

node('controls') {
    def version = "${env.version}"
    def ver = version.replaceAll('.','')
    def python_ver = 'python3'
    def SDK = ""
    def items = "controls:${env.WORKSPACE}/controls"

    echo "${env.JOB_NAME}"
    def TAGS = ""
    if ("${env.Tag1}" != "")
        TAGS = "${env.Tag1}"
    if ("${env.Tag2}" != "")
        TAGS = "${TAGS}, ${env.Tag2}"
    if ("${env.Tag3}" !="")
        TAGS = "${TAGS}, ${env.Tag3}"
    if ("${TAGS}" != "")
        TAGS = "--TAGS_TO_START ${TAGS}"

    stage("Checkout"){
        // Контролы
        dir("${env.WORKSPACE}") {
            checkout([$class: 'GitSCM',
               branches: [[name: "${env.BRANCH_NAME}"]],
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
         dir("./controls"){
            sh """
               git fetch
               git merge origin/rc-${version}
            """
         }

        // Выкачиваем platform и cdn
        dir("${env.WORKSPACE}") {
            checkout([$class: 'GitSCM',
            branches: [[name: "rc-${env.version}"]],
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

        // Выкачиваем constructor
        dir("./constructor") {
            checkout([$class: 'GitSCM',
            branches: [[name: "rc-${env.version}"]],
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

        // Определяем SDK
        dir("./constructor/Constructor/SDK") {
            SDK = sh returnStdout: true, script: "${python_ver} getSDK.py ${env.version} --conf linux_x86_64 -b"
            SDK = SDK.trim()
            echo "${SDK}"
        }

        // Выкачиваем atf
        dir("./controls/tests/int") {
        checkout([$class: 'GitSCM',
            branches: [[name: "${env.branch_atf}"]],
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

        // Выкачиваем engine
        dir("./controls/tests"){
            checkout([$class: 'GitSCM',
            branches: [[name: "${env.branch_engine}"]],
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
        // Выкачиваем demo_stand
        dir("${env.WORKSPACE}") {
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
        // Копируем /demo_stand/client в /tests/stand/client
        sh "cp -rf ./demo_stand/client ./controls/tests/stand"

        // Выкачиваем ws для unit тестов и если указан сторонний бранч
        if (("${env.run_tests}" == "only_unit" ) || ("${run_tests}" == "all") || ("${env.ws_revision}" != "sdk") ){
            def ws_revision = "${env.ws_revision}"
            if ("${env.ws_revision}" == "sdk"){
                ws_revision = sh returnStdout: true, script: "${python_ver} ${env.WORKSPACE}/constructor/read_meta.py -rev ${SDK}/meta.info ws"
            }
            dir("${env.WORKSPACE}") {
                checkout([$class: 'GitSCM',
                branches: [[name: "${ws_revision}"]],
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
        // Выкачиваем ws.data для unit тестов и если указан сторонний бранч
        if (("${env.run_tests}" == "only_unit" ) || ("${run_tests}" == "all") || ("${env.ws_data_revision}" != "sdk") ){
            def ws_data_revision = "${env.ws_data_revision}"
            if ("${env.ws_data_revision}" == "sdk"){
                ws_data_revision = sh returnStdout: true, script: "${python_ver} ${env.WORKSPACE}/constructor/read_meta.py -rev ${SDK}/meta.info ws_data"
            }
            dir("${env.WORKSPACE}") {
                checkout([$class: 'GitSCM',
                branches: [[name: "${ws_data_revision}"]],
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

    stage("Сборка компонент"){
        // Собираем controls
        dir("./controls"){
            sh "${python_ver} ${env.WORKSPACE}/constructor/build_controls.py ${env.WORKSPACE}/controls ${env.BUILD_NUMBER}"
        }
        dir("${WORKSPACE}"){
            // Собираем ws если задан сторонний бранч
            if ("${env.ws_revision}" != "sdk"){
                sh "mkdir ${WORKSPACE}/WIS-git-temp2"
                sh "${python_ver} ${env.WORKSPACE}/constructor/build_ws.py ${env.WORKSPACE}/WIS-git-temp 'release' ${env.WORKSPACE}/WIS-git-temp2 ${env.BUILD_NUMBER} --not_web_sdk NOT_WEB_SDK"
                // Добавляем в items
                items = items + ", ws:${env.WORKSPACE}/WIS-git-temp2"
            }
            // Собираем ws.data только когда указан сторонний бранч
            if ("${env.ws_data_revision}" != "sdk"){
                sh "${python_ver} ${env.WORKSPACE}/constructor/build_ws_data.py ${env.WORKSPACE}/ws_data ${env.WORKSPACE} ${env.BUILD_NUMBER} ${env.BUILD_ID}"
                // Добавляем в items
                items = items + ", ws_data:${env.WORKSPACE}/WS.Data"
            }
        }
    }

    stage("Unit тесты"){
        if (("${env.run_tests}" == "only_unit" ) || ("${run_tests}" == "all")){
            dir("${WORKSPACE}"){
                sh "cp -rf ./WIS-git-temp ./controls/sbis3-ws"
                sh "cp -rf ./ws_data/WS.Data ./controls/components/"
                sh "cp -rf ./ws_data/WS.Data ./controls/"
            }
            dir("./controls"){
                sh "npm config set registry http://npmregistry.sbis.ru:81/"

                sh "sh ./bin/test-isolated"
                sh "mv ./artifacts/xunit-report.xml ./artifacts/test-isolated-report.xml"

                sh """
                export test_url_host = ${env.NODE_NAME}
                export test_server_port = 10253
                export test_url_port = 10253
                export WEBDRIVER_remote_enabled = 1
                export WEBDRIVER_remote_host = 10.76.163.98
                export WEBDRIVER_remote_port = 4380
                sh ./bin/test-browser"""
                sh "mv ./artifacts/xunit-report.xml ./artifacts/test-browser-report.xml"
            }
        }
    }

    stage("Разворот стенда"){
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
            cd "${env.WORKSPACE}/controls/tests/stand/intest/"
            sudo python3 "change_theme.py" ${env.theme}
            cd "${env.WORKSPACE}"
        """
        sh """
            sudo chmod -R 0777 ${env.WORKSPACE}
            ${python_ver} "./constructor/updater.py" "${env.version}" "/home/sbis/Controls1" "css_${env.NODE_NAME}${ver}1" "./controls/tests/stand/conf/sbis-rpc-service.ini" "./controls/tests/stand/distrib_branch_new" --sdk_path "${SDK}" --items "${items}" --host test-autotest-db1 --stand nginx_branch --daemon_name Controls1
            sudo chmod -R 0777 ${env.WORKSPACE}
            sudo chmod -R 0777 /home/sbis/Controls1
        """

        //Пакуем данные
        writeFile file: "/home/sbis/Controls1/Core.package.json", text: """
            {
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
    work_dir = sh returnStdout: true, script: "python3 -c \"import os; print(os.path.basename('${env.WORKSPACE}'))\""
    writeFile file: "./controls/tests/int/config.ini", text:
        """# UTF-8
        [general]
        browser = ${env.browser_type}
        SITE = http://${NODE_NAME}:30001
        fail_test_repeat_times = 0
        DO_NOT_RESTART = True
        SOFT_RESTART = True
        NO_RESOURCES = True
        STREAMS_NUMBER = 20
        DELAY_RUN_TESTS = 2
        TAGS_NOT_TO_START = iOSOnly
        ELEMENT_OUTPUT_LOG = locator
        WAIT_ELEMENT_LOAD = 20
        HTTP_PATH = http://${NODE_NAME}:2100/${work_dir}/controls/tests/int/
        SERVER = test-autotest-db1
        BASE_VERSION = css_${NODE_NAME}${ver}1
        server_address = http://10.76.163.98:4380/wd/hub"""


    if ( "${env.theme}" != "online" ) {
         writeFile file: "./controls/tests/reg/config.ini",
         text:
            """# UTF-8
            [general]
            browser = ${env.browser_type}
            SITE = http://${NODE_NAME}:30001
            fail_test_repeat_times = 0
            DO_NOT_RESTART = True
            SOFT_RESTART = False
            NO_RESOURCES = True
            STREAMS_NUMBER = 40
            DELAY_RUN_TESTS = 2
            TAGS_TO_START = ${env.theme}
            ELEMENT_OUTPUT_LOG = locator
            WAIT_ELEMENT_LOAD = 20
            HTTP_PATH = http://${NODE_NAME}:2100/${work_dir}/controls/tests/reg/
            SERVER = test-autotest-db1
            BASE_VERSION = css_${NODE_NAME}${ver}1
            server_address = http://10.76.159.209:4444/wd/hub
            CHROME_BINARY_LOCATION=C:\\chrome64_58\\chrome.exe
            [regression]
            IMAGE_DIR = capture_${env.theme}
            RUN_REGRESSION=True"""
    } else {
         writeFile file: "./controls/tests/reg/config.ini",
         text:
            """# UTF-8
            [general]
            browser = ${env.browser_type}
            SITE = http://${NODE_NAME}:30001
            fail_test_repeat_times = 0
            DO_NOT_RESTART = True
            SOFT_RESTART = False
            NO_RESOURCES = True
            STREAMS_NUMBER = 15
            DELAY_RUN_TESTS = 2
            TAGS_TO_START = ${env.theme}
            ELEMENT_OUTPUT_LOG = locator
            WAIT_ELEMENT_LOAD = 20
            HTTP_PATH = http://${NODE_NAME}:2100/${work_dir}/controls/tests/reg/
            SERVER = test-autotest-db1
            BASE_VERSION = css_${NODE_NAME}${ver}1
            server_address = http://10.76.159.209:4444/wd/hub
            CHROME_BINARY_LOCATION=C:\\chrome64_58\\chrome.exe
            [regression]
            IMAGE_DIR = capture
            RUN_REGRESSION=True"""
    }

    stage("Инт.тесты"){
        if ("${env.run_tests}" != "only_reg"){
            def site = "http://${NODE_NAME}:30001"
            site.trim()
            if ( "${TAGS}" != "") {
               dir("./controls/tests/int"){
                sh """
                source /home/sbis/venv_for_test/bin/activate
                python start_tests.py --RESTART_AFTER_BUILD_MODE --TAGS_TO_START ${TAGS}
                deactivate
                """
               }
            } else {
               dir("./controls/tests/int"){
                sh """
                source /home/sbis/venv_for_test/bin/activate
                python start_tests.py --RESTART_AFTER_BUILD_MODE
                deactivate
                """
            }
            }
         }
    }
    stage("Рег.тесты"){
        if ("${env.run_tests}" != "only_int"){
            sh "cp -R ./controls/tests/int/atf/ ./controls/tests/reg/atf/"
            dir("./controls/tests/reg"){
                sh """
                    source /home/sbis/venv_for_test/bin/activate
                    python start_tests.py --RESTART_AFTER_BUILD_MODE
                    deactivate
                """
            }
        }
    }
    stage("Результаты"){
        dir("${env.WORKSPACE}"){
           publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: false, reportDir: './controls/tests/reg/capture_report/', reportFiles: 'report.html', reportName: 'Regression Report', reportTitles: ''])
        }
        junit keepLongStdio: true, testResults: "**/test-reports/*.xml"
        junit keepLongStdio: true, testResults: "./controls/artifacts/test-isolated-report.xml"
        junit keepLongStdio: true, testResults: "./controls/artifacts/test-browser-report.xml"
        archiveArtifacts allowEmptyArchive: true, artifacts: '**/report.zip', caseSensitive: false
        archiveArtifacts allowEmptyArchive: true, artifacts: '**/result.db', caseSensitive: false
    }

}
