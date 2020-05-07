@Library('pipeline') _

def version = '20.4000'


node ('controls') {
    checkout_pipeline("20.4000/bugfix/bls/checkout_test")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}