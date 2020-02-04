@Library('pipeline@bugfix/version_atf') _

def version = '20.3000'

node ('controls') {
    checkout_pipeline("20.2000/bugfix/bls/libs_new_24")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}
