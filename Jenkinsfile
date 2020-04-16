@Library('pipeline') _

def version = '20.4000'


node ('controls') {
    checkout_pipeline("20.3000/pea/chacnge_check_stand2")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}



