node ('controls') {
def version = "19.310"
def workspace = "/home/sbis/workspace/controls_${version}/${BRANCH_NAME}"
    ws (workspace){
        deleteDir()
        checkout([$class: 'GitSCM',
            branches: [[name: "19.310/pea/fix_decription"]],
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
        run_unit = load "./jenkins_pipeline/platforma/branch/run_unit"
        timeout(time: 60, unit: 'MINUTES') {
            start.start(version, workspace, helper)
        }
    }
}
