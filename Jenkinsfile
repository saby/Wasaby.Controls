@Library('pipeline@bugfix/platform_version') _

def version = '20.3100'


node ('controls') {
    checkout_pipeline("20.3100/bugfix/platfor_version")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}