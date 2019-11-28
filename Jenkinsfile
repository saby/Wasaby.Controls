@Library('pipeline@bls/mew_ui') _

def version = '20.1000'

node ('controls') {
    echo version
    checkout_pipeline(version)
   // run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
   // run_branch.execute('controls', version)
}
