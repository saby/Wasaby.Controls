@Library('pipeline') _

def version = '20.3100'


node ('controls') {
    checkout_pipeline("20.3100/kua/testing_ff_76")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}