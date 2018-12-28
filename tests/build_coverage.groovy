#!/usr/bin/env groovy
{workspace, scheduler=null -> building(workspace, scheduler=null)}

def building(workspace, scheduler=null) {
    echo "Задаем параметры сборки"
    def version = env.JOB_BASE_NAME.split('_')[1]
    echo "Читаем настройки из файла version_application.txt"
    def props = readProperties file: "/home/sbis/mount_test-osr-source_d/Платформа/${version}/version_application.txt"
    echo "Генерируем параметры"
    // для запуска сборки по расписанию
    if (scheduler) {
      triggers = pipelineTriggers([cron(scheduler)])
    } else {
      triggers = pipelineTriggers([])
    }
    properties([
    disableConcurrentBuilds(),
    gitLabConnection('git'),
    buildDiscarder(
        logRotator(
            artifactDaysToKeepStr: '3',
            artifactNumToKeepStr: '3',
            daysToKeepStr: '3',
            numToKeepStr: '3')),
        parameters([
            string(
                defaultValue: props["engine"],
                description: '',
                name: 'branch_engine'),
            string(
                defaultValue: "",
                description: '',
                name: 'branch_atf'),
            string(
                defaultValue: '',
                description: '',
                name: 'branch_themes'),
             string(
                defaultValue: '',
                description: '',
                name: 'branch_viewsettings'),
            ]),
        triggers
    ])

    echo "Определяем рабочую директорию"

    ws(workspace) {

        try {
        echo "Чистим рабочую директорию"
        deleteDir()

		echo "Назначаем переменные"
        def server_address=props["SERVER_ADDRESS"]
		def stream_number=props["snit"]
        def ver = version.replaceAll('.','')
        def SDK = ""
        def items = "controls:${workspace}/controls, controls_new:${workspace}/controls, controls_theme:${workspace}/controls"

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

        def branch_navigation
		if (params.branch_navigation) {
			branch_navigation = params.branch_navigation
		} else {
			branch_navigation = props["navigation"]
		}

        def branch_themes
        if (params.branch_themes) {
            branch_themes = params.branch_themes
        } else {
            branch_themes = props["themes"]
        }
        def branch_viewsettings
        if (params.branch_viewsettings) {
            branch_viewsettings = params.branch_viewsettings
        } else {
            branch_viewsettings = props["viewsettings"]
        }

        echo "Выкачиваем хранилища"
        stage("Checkout"){
            parallel (
                checkout1: {
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
                            dir('./controls'){
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
                        },
                        checkout_navigation: {
                            echo " Выкачиваем Navigation"
                            dir("./controls/tests"){
                                checkout([$class: 'GitSCM',
                                branches: [[name: branch_navigation]],
                                doGenerateSubmoduleConfigurations: false,
                                extensions: [[
                                    $class: 'RelativeTargetDirectory',
                                    relativeTargetDir: "navigation"
                                    ]],
                                    submoduleCfg: [],
                                    userRemoteConfigs: [[
                                        credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                        url: 'git@git.sbis.ru:navigation-configuration/navigation.git']]
                                ])
                            }
                        },
                        checkout_viewsettings: {
                            echo " Выкачиваем viewsettings"
                            dir("./controls"){
                                checkout([$class: 'GitSCM',
                                branches: [[name: branch_viewsettings]],
                                doGenerateSubmoduleConfigurations: false,
                                extensions: [[
                                    $class: 'RelativeTargetDirectory',
                                    relativeTargetDir: "viewsettings"
                                    ]],
                                    submoduleCfg: [],
                                    userRemoteConfigs: [[
                                        credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                        url: 'git@git.sbis.ru:engine/viewsettings.git']]
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
                },
                checkout4: {
                    dir(workspace) {
                        echo "Выкачиваем themes"
                        checkout([$class: 'GitSCM',
                        branches: [[name: branch_themes]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'RelativeTargetDirectory',
                            relativeTargetDir: "themes"
                            ]],
                            submoduleCfg: [],
                            userRemoteConfigs: [[
                                credentialsId: 'ae2eb912-9d99-4c34-ace5-e13487a9a20b',
                                url: 'git@git.sbis.ru:retail/themes.git']]
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
                    echo "Выкачиваем ws"
                    ws_revision = sh returnStdout: true, script: "python3 ${workspace}/constructor/read_meta.py -rev ${SDK}/meta.info ws"
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
                },
                ws_data: {
                    echo "Выкачиваем ws.data"
                    ws_data_revision = sh returnStdout: true, script: "python3 ${workspace}/constructor/read_meta.py -rev ${SDK}/meta.info ws_data"
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
                },
                controls: {
                    echo "Переключаемся на controls из последнего sdk"
                    controls_revision = sh returnStdout: true, script: "python3 ${workspace}/constructor/read_meta.py -rev ${SDK}/meta.info controls"

            })
            echo "Собираем controls"
            dir("./controls"){
                echo "подкидываем istanbul в Controls"

                sh 'istanbul instrument --complete-copy --output ./SBIS3.CONTROLS-cover ./SBIS3.CONTROLS'
                sh 'sudo mv ./SBIS3.CONTROLS ./SBIS3.CONTROLS-orig && sudo mv ./SBIS3.CONTROLS-cover ./SBIS3.CONTROLS'

                sh 'istanbul instrument --complete-copy --output ./controls-cover ./Controls'
                sh 'istanbul instrument --complete-copy --output ./controls-demo-cover ./Controls-demo'

                sh 'sudo mv ./Controls ./Controls-orig && sudo mv ./controls-cover ./Controls'
                sh 'sudo mv ./Controls-demo ./Controls-demo-orig && sudo mv ./controls-demo-cover ./Controls-demo'

            }
            dir("./WIS-git-temp") {
                echo "подкидываем istanbul в WS"
                sh 'istanbul instrument -x "lib/Ext/" -x "ext/" --complete-copy --output ws/core-covered ws/core'
                sh 'istanbul instrument --complete-copy --output View-covered View'
                sh 'sudo mv ./ws/core ./ws/core-orig && sudo mv ./ws/core-covered ./ws/core'
                sh 'sudo mv ./View ./View-orig && sudo mv ./View-covered ./View'
            }
            dir("./ws_data"){
                echo "подкидываем istanbul в WS.DATA"
                sh 'istanbul instrument --complete-copy --output WS.Data-covered WS.Data'
                sh 'sudo mv ./WS.Data ./WS.Data-orig && sudo mv ./WS.Data-covered ./WS.Data'
            }
            dir("./controls/sbis3-app-engine"){
                echo "подкидываем istanbul в SBIS3.ENGINE"
                sh 'istanbul instrument --complete-copy --output engine-covered ./client'
                sh 'sudo mv ./client ./client-orig && sudo mv ./engine-covered ./client'
            }

            sh "python3 ${workspace}/constructor/build_controls.py ${workspace}/controls ${env.BUILD_NUMBER} --not_web_sdk NOT_WEB_SDK"

            dir(workspace){
                echo "Собираем ws"
                sh "rm -rf ${workspace}/WIS-git-temp2"
                sh "mkdir ${workspace}/WIS-git-temp2"
                sh "python3 ${workspace}/constructor/build_ws.py ${workspace}/WIS-git-temp 'release' ${workspace}/WIS-git-temp2 ${env.BUILD_NUMBER} --not_web_sdk NOT_WEB_SDK"
                echo "Добавляем в items"
                items = items + ", ws:${workspace}/WIS-git-temp2, view:${workspace}/WIS-git-temp2, vdom:${workspace}/WIS-git-temp2, ws_deprecated:${workspace}/WIS-git-temp2, ws_core:${workspace}/WIS-git-temp2"

                echo "Собираем ws.data"
                echo "Добавляем в items"
                items = items + ", ws_data:${workspace}/ws_data"

            }
            echo items
        }
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
                МаксимальныйРазмерВыборкиСписочныхМетодов=0

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
                МаксимальныйРазмерВыборкиСписочныхМетодов=0
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
                sudo chmod -R 0777 ${workspace}
                python3 "./constructor/updater.py" "${version}" "/home/sbis/Controls" "css_${env.NODE_NAME}${ver}1" "./controls/tests/stand/conf/sbis-rpc-service.ini" "./controls/tests/stand/distrib_branch_ps" --sdk_path "${SDK}" --items "${items}" --host test-autotest-db1 --stand nginx_branch --daemon_name Controls --use_ps --conf x86_64
                sudo chmod -R 0777 ${workspace}
                sudo chmod -R 0777 /home/sbis/Controls
            """
        }
        stage("Инт.тесты"){
            writeFile file: "./controls/tests/int/config.ini", text:
            """# UTF-8
            [general]
            browser = chrome
            SITE = http://${NODE_NAME}:30010
            SERVER = test-autotest-db1:5434
            BASE_VERSION = css_${NODE_NAME}${ver}1
            DO_NOT_RESTART = True
            SOFT_RESTART = True
            NO_RESOURCES = True
            DELAY_RUN_TESTS = 2
            TAGS_NOT_TO_START = iOSOnly
            ELEMENT_OUTPUT_LOG = locator
            WAIT_ELEMENT_LOAD = 20
            HTTP_PATH = http://${NODE_NAME}:2100/controls_${version}/${env.JOB_BASE_NAME}/controls/tests/int/"""

        dir("./controls/tests/int"){
            sh"""
                source /home/sbis/venv_for_test/bin/activate
                python start_tests.py --files_to_start smoke_test.py --SERVER_ADDRESS ${server_address} --RESTART_AFTER_BUILD_MODE --BROWSER chrome --FAIL_TEST_REPEAT_TIMES 0
                deactivate

            """
            junit keepLongStdio: true, testResults: "**/test-reports/*.xml"
            sh "sudo rm -rf ./test-reports"
            if ( currentBuild.result != null ) {
                currentBuild.result = 'FAILURE'
                currentBuild.displayName = "#${env.BUILD_NUMBER} SMOKE TEST FAIL"
                error('Стенд неработоспособен (не прошел smoke test).')
            }
        }

            echo "Запускаем интеграционные тесты"
            dir("./controls/tests/int"){
                sh """
                source /home/sbis/venv_for_test/bin/activate
                python start_tests.py --RESTART_AFTER_BUILD_MODE --SERVER_ADDRESS ${server_address} --STREAMS_NUMBER ${stream_number} --COVERAGE True --RECURSIVE_SEARCH True
                deactivate
                """
                }

        }
        stage("Coverage") {
            echo "Записываем результаты в файл"
            dir("./controls/tests"){
                sh """
                python3 coverage_handler.py -s ${workspace}/controls/tests/int/coverage
                """
            }
        }

    } catch (err) {
        echo "${err}"

    } finally {
        sh """
            sudo chmod -R 0777 ${workspace}
            sudo chmod -R 0777 /home/sbis/Controls
        """
        archiveArtifacts artifacts: '**/result.json', fingerprint: true, onlyIfSuccessful: true
        junit keepLongStdio: true, testResults: "**/test-reports/*.xml"

        }
    }
}
return this