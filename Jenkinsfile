@Library('pipeline') _

def version = '20.6100'


node ('controls') {
    //checkout_pipeline("rc-${version}")
    checkout_pipeline("20.6100/feature/may/delete-navx-090920")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}