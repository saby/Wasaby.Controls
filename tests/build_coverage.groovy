#!/usr/bin/env groovy
{workspace, scheduler=null -> building(workspace, scheduler=null)}

def building(workspace, scheduler=null) {
    echo "Задаем параметры сборки"
    def version = env.JOB_BASE_NAME.split('_')[2]
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
        triggers
    ])

        try {
		echo "Назначаем переменные"
        def server_address=props["SERVER_ADDRESS"]
		def stream_number=props["snit"]
        def ver = version.replaceAll('.','')
        def SDK = ""
        def items = "controls:${workspace}/controls, controls_new:${workspace}/controls, controls_theme:${workspace}/controls"

		def branch_atf = props["atf_co"]
        def branch_engine = props["engine"]
        def branch_navigation = props["navigation"]
        def branch_themes = props["themes"]
        def branch_viewsettings = props["viewsettings"]

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


            dir(workspace){
                echo "подкидываем istanbul в Controls"
                sh 'istanbul instrument -x bin/** -x tests/** -x viewsettings/** -x sbis3-app-engine/** -x grunt/** --complete-copy --output ./controls-cover ./controls'
                sh 'sudo mv ./controls ./controls-orig && sudo mv ./controls-cover ./controls'
            }
            dir (workspace) {
                echo "подкидываем оргинальные файлы"
                sh 'cp -rf ./controls-orig/bin/ ./controls/bin/'
                sh 'cp -rf ./controls-orig/tests/ ./controls/tests/'
                sh 'cp -rf ./controls-orig/viewsettings/ ./controls/viewsettings/'
                sh 'cp -rf ./controls-orig/sbis3-app-engine/ ./controls/sbis3-app-engine/'
                sh 'cp -rf ./controls-orig/grunt/ ./controls/grunt/'
            }

            echo "Собираем controls"
            sh "python3 ${workspace}/constructor/build_controls.py ${workspace}/controls ${env.BUILD_NUMBER} --not_web_sdk NOT_WEB_SDK"
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
return this