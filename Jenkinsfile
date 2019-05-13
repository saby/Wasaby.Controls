def user
def userInput
try{
   user = currentBuild.rawBuild.getCauses()[0].getUserId()
} catch (err) {
    user = ''
}

if ( env.PRIVILEGE_USERS.split(",").contains(user) ) {
    try {
        timeout(time: 10, unit: 'SECONDS') {
            userInput= input(
                id: 'userInput',
                message: 'Параметры',
                ok: 'Next',
                parameters: [
                    booleanParam(defaultValue: false, description: "Я разработчик автотестов", name: 'run_boss')

            ])
        }
    } catch (err) {
        userInput = false
    }
}
node ('controls') {
def version = "19.400"
def workspace = "/home/sbis/workspace/controls_${version}/${BRANCH_NAME}"
    ws (workspace){
        deleteDir()
        checkout([$class: 'GitSCM',
            //branches: [[name: "rc-${version}"]],
			branches: [[name: "19.310/feature/may/for-stan-080519"]],
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
            start.start(version, workspace, helper, userInput)
        }
    }
}
