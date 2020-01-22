@Library('pipeline') _

def version = '20.1000'

node ('controls') {
    checkout_pipeline("20.1000/bugfix/bls/tests_controls_test_1")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}
