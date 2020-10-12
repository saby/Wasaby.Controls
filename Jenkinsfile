@Library('pipeline') _

def version = '20.7000'


node ('controls') {
    //checkout_pipeline("rc-${version}")
    checkout_pipeline("20.7000/feature/may/new-themes-121020")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}