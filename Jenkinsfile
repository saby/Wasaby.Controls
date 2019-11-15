import java.time.*
import java.lang.Math

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
def version = "19.720"
def workspace = "/home/sbis/workspace/controls_${version}/${BRANCH_NAME}"
    dir (workspace){
        deleteDir()
        checkout([$class: 'GitSCM',
            branches: [[name: "rc-${version}"]],
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
			LocalDateTime start_time = LocalDateTime.now();
			echo "Время начала сборки: ${start_time}"
			try {
				start.start(version, workspace)
			} finally {
				LocalDateTime end_time = LocalDateTime.now();
				echo "Время конца сборки: ${end_time}"
				Duration duration = Duration.between(end_time, start_time);
				diff_time = Math.abs(duration.toMillis());
				helper.time_stages(currentBuild, diff_time, "${BUILD_URL}", version, "controls")
			}
        }
    }
}
