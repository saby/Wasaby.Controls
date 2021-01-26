@Library('pipeline') _

def version = '21.1100'


node ('controls') { 
    checkout_pipeline("21.1000/bugfix/jenkins_controls")
    run_branch = load '/home/sbis/jenkins_pipeline/platforma/branch/run_branch'
    run_branch.execute('wasaby_controls', version)
}