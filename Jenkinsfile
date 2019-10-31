@Library('pipeline') _

def version = '20.1000/pea/jf_move'

node ('controls') {
    checkout_pipeline(version)
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('ws', '20.1000')
}