@Library('pipeline') _

def version = '20.7100'


node ('controls') {
    checkout_pipeline("20.7100/kua/unskip_controls_reg")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}