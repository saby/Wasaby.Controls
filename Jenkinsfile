#!groovy
echo "Задаем параметры сборки"
def version = "3.18.350"

def gitlabStatusUpdate() {
    if ( currentBuild.currentResult == "ABORTED" ) {
        updateGitlabCommitStatus state: 'canceled'
    } else if ( currentBuild.currentResult in ["UNSTABLE", "FAILURE"] ) {
        updateGitlabCommitStatus state: 'failed'
    } else if ( currentBuild.currentResult == "SUCCESS" ) {
        updateGitlabCommitStatus state: 'success'
    }
}


node('controls') {
    echo "Читаем настройки из файла version_application.txt"
    def props = readProperties file: "/home/sbis/mount_test-osr-source_d/Платформа/${version}/version_application.txt"
    echo "Генерируем параметры"
    properties([
    disableConcurrentBuilds(),
    gitLabConnection('git'),
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '100',
            artifactNumToKeepStr: '100',
            daysToKeepStr: '100',
            numToKeepStr: '100')),
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
                defaultValue: props["engine"],
                description: '',
                name: 'branch_engine'),
            string(
                defaultValue: "",
                description: '',
                name: 'branch_atf'),
            choice(
                choices: "online\npresto\ncarry\ngenie",
                description: '',
                name: 'theme'),
            choice(choices: "chrome\nff\nie\nedge", description: '', name: 'browser_type'),
            booleanParam(defaultValue: false, description: "Запуск тестов верстки", name: 'run_reg'),
            booleanParam(defaultValue: false, description: "Запуск интеграционных тестов", name: 'run_int'),
            booleanParam(defaultValue: false, description: "Запуск unit тестов", name: 'run_unit'),
            booleanParam(defaultValue: false, description: "Запуск только упавших тестов из предыдущего билда", name: 'RUN_ONLY_FAIL_TEST')
            ]),
        pipelineTriggers([cron(H */1 * * 5-7)])
    ])


    if ( "${env.BUILD_NUMBER}" != "1" && !params.run_reg && !params.run_int && !params.run_unit) {
            currentBuild.result = 'FAILURE'
            currentBuild.displayName = "#${env.BUILD_NUMBER} TESTS NOT BUILD"
            error('Ветка запустилась по пушу, либо запуск с некоректными параметрами')
        }


    echo "Определяем рабочую директорию"
    def workspace = "/home/sbis/workspace/controls_${version}/${BRANCH_NAME}"
    ws(workspace) {
        def inte = params.run_int
        def regr = params.run_reg
        def unit = params.run_unit

        try {
        echo "Чистим рабочую директорию"
        deleteDir()

		echo "Назначаем переменные"
        def server_address=props["SERVER_ADDRESS"]
		def smoke_server_address=props["SMOKE_SERVER_ADDRESS"]
		def stream_number=props["snit"]
        def ver = version.replaceAll('.','')
		def python_ver = 'python3'
        def SDK = ""
        def items = "controls:${workspace}/controls, controls_new:${workspace}/controls, controls_file:${workspace}/controls"

		def branch_atf
		if (params.branch_atf) {
			branch_atf = params.branch_atf
		} else {
			branch_atf = props["atf_co"]
		}

        def branch_engine
		if (params.branch_engine) {
			branch_engine = params.branch_engine
		} else {
			branch_engine = props["engine"]
		}

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
                    updateGitlabCommitStatus state: 'running'
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
                        branches: [[name: props["cdn"]]],
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
                }
            )
        }
        stage("Сборка компонент"){
            echo " Определяем SDK"
            dir("./constructor/Constructor/SDK") {
                SDK = sh returnStdout: true, script: "export PLATFORM_version=${version} && source ${workspace}/constructor/Constructor/SDK/setToSDK.sh linux_x86_64"
                SDK = SDK.trim()
                echo SDK
            }
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
        if ( inte || regr ) {
        stage("Разворот стенда"){
            echo "Запускаем разворот стенда и подготавливаем окружение для тестов"
            // Создаем sbis-rpc-service.ini
            def host_db = "test-autotest-db1"
            def port_db = "5434"
            def name_db = "css_${env.NODE_NAME}${ver}1"
            def user_db = "postgres"
            def password_db = "postgres"
            writeFile file: "./controls/tests/stand/conf/sbis-rpc-service_ps.ini", text: """[Базовая конфигурация]
                [Ядро.Http]
                Порт=10020

                [Ядро.Сервер приложений]
                ЧислоРабочихПроцессов=3
                ЧислоСлужебныхРабочихПроцессов=0
                ЧислоДополнительныхПроцессов=0
                ЧислоПотоковВРабочихПроцессах=10

                [Presentation Service]
                WarmUpEnabled=No
                ExtractLicense=Нет
                ExtractRights=Нет
                ExtractSystemExtensions=Нет
                ExtractUserInfo=Нет"""
            writeFile file: "./controls/tests/stand/conf/sbis-rpc-service.ini", text: """[Базовая конфигурация]
                АдресСервиса=${env.NODE_NAME}:10010
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
                Адрес=http://${env.NODE_NAME}:10010"""
            // Копируем шаблоны
            sh """cp -f ./controls/tests/stand/Intest/pageTemplates/branch/* ./controls/tests/stand/Intest/pageTemplates"""
            sh """cp -fr ./controls/Examples/ ./controls/tests/stand/Intest/Examples/"""
            sh """
                cd "${workspace}/controls/tests/stand/Intest/"
                sudo python3 "change_theme.py" ${params.theme}
                cd "${workspace}"

            """
            sh """
                sudo chmod -R 0777 ${workspace}
                ${python_ver} "./constructor/updater.py" "${version}" "/home/sbis/Controls" "css_${env.NODE_NAME}${ver}1" "./controls/tests/stand/conf/sbis-rpc-service.ini" "./controls/tests/stand/distrib_branch_ps" --sdk_path "${SDK}" --items "${items}" --host test-autotest-db1 --stand nginx_branch --daemon_name Controls --use_ps --conf x86_64
                sudo chmod -R 0777 ${workspace}
                sudo chmod -R 0777 /home/sbis/Controls
            """
        }
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
                            export WEBDRIVER_remote_host=10.76.159.209
                            export WEBDRIVER_remote_port=4444
                            export test_report=artifacts/test-browser-report.xml
                            sh ./bin/test-browser"""
                        }
                    )
                }
            }
        }
    if ( inte || regr ) {
        def soft_restart = "True"
        if ( params.browser_type in ['ie', 'edge'] ){
			soft_restart = "False"
		}

        writeFile file: "./controls/tests/int/config.ini", text:
            """# UTF-8
            [general]
            browser = ${params.browser_type}
            SITE = http://${NODE_NAME}:30010
            SERVER = test-autotest-db1:5434
            BASE_VERSION = css_${NODE_NAME}${ver}1
            DO_NOT_RESTART = True
            SOFT_RESTART = ${soft_restart}
            NO_RESOURCES = True
            DELAY_RUN_TESTS = 2
            TAGS_NOT_TO_START = iOSOnly
            ELEMENT_OUTPUT_LOG = locator
            WAIT_ELEMENT_LOAD = 20
            HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${BRANCH_NAME}/controls/tests/int/"""

        if ( "${params.theme}" != "online" ) {
            writeFile file: "./controls/tests/reg/config.ini",
            text:
                """# UTF-8
                [general]
                browser = ${params.browser_type}
                SITE = http://${NODE_NAME}:30010
                DO_NOT_RESTART = True
                SOFT_RESTART = False
                NO_RESOURCES = True
                DELAY_RUN_TESTS = 2
                TAGS_TO_START = ${params.theme}
                ELEMENT_OUTPUT_LOG = locator
                WAIT_ELEMENT_LOAD = 20
                HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${BRANCH_NAME}/controls/tests/reg/
                SERVER = test-autotest-db1:5434
                BASE_VERSION = css_${NODE_NAME}${ver}1
                #BRANCH=True
                [regression]
                IMAGE_DIR = capture_${params.theme}
                RUN_REGRESSION=True"""
        } else {
            writeFile file: "./controls/tests/reg/config.ini",
            text:
                """# UTF-8
                [general]
                browser = ${params.browser_type}
                SITE = http://${NODE_NAME}:30010
                DO_NOT_RESTART = True
                SOFT_RESTART = False
                NO_RESOURCES = True
                DELAY_RUN_TESTS = 2
                TAGS_TO_START = ${params.theme}
                ELEMENT_OUTPUT_LOG = locator
                WAIT_ELEMENT_LOAD = 20
                HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${BRANCH_NAME}/controls/tests/reg/
                SERVER = test-autotest-db1:5434
                BASE_VERSION = css_${NODE_NAME}${ver}1
                #BRANCH=True
                [regression]
                IMAGE_DIR = capture
                RUN_REGRESSION=True"""
        }

        def site = "http://${NODE_NAME}:30010"
        site.trim()
        dir("./controls/tests/int"){
            tmp_smoke = sh returnStatus:true, script: """
                source /home/sbis/venv_for_test/bin/activate
                ${python_ver} start_tests.py --files_to_start smoke_test.py --SERVER_ADDRESS ${server_address} --RESTART_AFTER_BUILD_MODE --BROWSER chrome
                deactivate
            """
            if ( "${tmp_smoke}" != "0" ) {
                currentBuild.result = 'FAILURE'
                currentBuild.displayName = "#${env.BUILD_NUMBER} SMOKE TEST FAIL"
                gitlabStatusUpdate()
                error('Стенд неработоспособен (не прошел smoke test).')
            }
        }

        def run_test_fail = ""
        if (params.RUN_ONLY_FAIL_TEST == true){
            run_test_fail = "-sf"
            step([$class: 'CopyArtifact', fingerprintArtifacts: true, projectName: "${env.JOB_NAME}", selector: [$class: 'LastCompletedBuildSelector']])
        }
        parallel (
            int_test: {
                echo "Запускаем интеграционные тесты"
                stage("Инт.тесты"){
                    if ( inte ){
                        dir("./controls/tests/int"){
                            sh """
                            source /home/sbis/venv_for_test/bin/activate
                            python start_tests.py --RESTART_AFTER_BUILD_MODE ${run_test_fail} --SERVER_ADDRESS ${server_address} --STREAMS_NUMBER ${stream_number}
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
                                python start_tests.py --RESTART_AFTER_BUILD_MODE ${run_test_fail} --SERVER_ADDRESS http://test-selenium39-unix.unix.tensor.ru:4444/wd/hub --DISPATCHER_RUN_MODE --STAND platform --STREAMS_NUMBER ${stream_number}
                                deactivate
                            """
                        }

                    }
                }
            }

        )
    }
} finally {
    sh """
        sudo chmod -R 0777 ${workspace}
        sudo chmod -R 0777 /home/sbis/Controls
    """


        if ( regr ){
            dir("./controls") {
                publishHTML([allowMissing: true, alwaysLinkToLastBuild: false, keepAll: false, reportDir: './tests/reg/capture_report/', reportFiles: 'report.html', reportName: 'Regression Report', reportTitles: ''])
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
    gitlabStatusUpdate()
        }
    }
}
