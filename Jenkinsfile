node ('controls') {
def version = "19.200"
def workspace = "/home/sbis/workspace/controls_${version}/${BRANCH_NAME}"
    ws (workspace){
        deleteDir()
        checkout([$class: 'GitSCM',
            branches: [[name: "19.200/feature/pea/stability_tests_all_ws_engine"]],
            doGenerateSubmoduleConfigurations: false,
            extensions: [[
                $class: 'RelativeTargetDirectory',
                relativeTargetDir: "jenkins_pipeline"
                ]],
                submoduleCfg: [],
                userRemoteConfigs: [[
                    credentialsId: CREDENTIAL_ID_GIT,
                    url: "${GIT}:sbis-ci/jenkins_pipeline.git"]]
                                    ])
        helper = load "./jenkins_pipeline/platforma/branch/helper"
        start = load "./jenkins_pipeline/platforma/branch/JenkinsfileControls"
        start.start(version, workspace, helper)
    }
}
