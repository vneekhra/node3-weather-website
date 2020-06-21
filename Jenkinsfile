// Jenkinsfile for NodeJS App - CI/CD
def templateName = 'weather-nodejs'
def DEPLOY_TO = 'dev'

openshift.withCluster() {
  env.NAMESPACE = openshift.project()
  echo "Starting Pipeline env.NAMESPACE= ${env.NAMESPACE}..."
  echo "Starting Pipeline JOB_NAME= ${JOB_NAME}..."
  env.APP_NAME = "${JOB_NAME}".replaceAll(/-build.*/, '')
  echo "Starting Pipeline env.APP_NAME= ${env.APP_NAME}"
  echo "Starting Pipeline APP_NAME= ${APP_NAME}"
  env.BUILD = "${env.NAMESPACE}"
  env.DEV = "${APP_NAME}-dev"
  env.STAGE = "${APP_NAME}-stage"
  env.PROD = "${APP_NAME}-prod"
  echo "APPLICATION_NAME: ${params.APPLICATION_NAME}"
  echo "BLUE_GREEN: ${params.BLUE_GREEN}"
  echo "THIS WILL BE DEPLOYED IN PRODUCTION ${params.BLUE_GREEN} ENVIRONMENT"
  //echo "Default DEPLOY_TO: ${DEPLOY_TO}"
}

pipeline {
  agent any

  tools {nodejs "nodejs"}

  stages {
    stage('preamble') {
        steps {
            script {
                openshift.withCluster() {
                    openshift.withProject() {
                        //echo "Using project: ${openshift.project()}"
                        //echo "APPLICATION_NAME: ${params.APPLICATION_NAME}"
                        DEPLOY_TO = input(
                          message: 'Where to deploy?', 
                          parameters: [
                            [$class: 'ChoiceParameterDefinition', 
                            choices: 'dev\nstage\nprod', 
                            name: 'input', 
                            description: 'Select the environment where you want to deploy the application.']
                          ])
                        echo "Deploy till ${DEPLOY_TO} environment!!!"
                    }
                }
            }
        }
    }
    // Build Application using npm
    stage('Building application') {
      steps {
        sh "npm install"
      }
    }
      
    // Run NPM unit tests
    stage('Unit Testing application'){
      steps {
        sh "npm run test"
      }
    }
      
    // Build Container Image using the artifacts produced in previous stages
    stage('Build NodeJS App Image'){
      steps {
        script {
          // Build container image using local Openshift cluster
          openshift.withCluster() {
            openshift.withProject() {
              timeout (time: 10, unit: 'MINUTES') {
                echo "Deploy till ${DEPLOY_TO} environment!"
                // run the build and wait for completion
                def build = openshift.selector("bc", "${params.APPLICATION_NAME}").startBuild("--from-dir=.")
                                    
                // print the build logs
                build.logs('-f')
              }
            }        
          }
        }
      }
    } 
    stage('Promote to Dev') {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              if (DEPLOY_TO == 'dev' || DEPLOY_TO == 'stage' || DEPLOY_TO == 'prod') {
                //echo "In DEV stage from== ${env.BUILD}/${params.APPLICATION_NAME}:latest"
                //echo "In DEV stage to== ${env.DEV}/${params.APPLICATION_NAME}:latest"
                openshift.tag("${env.BUILD}/${params.APPLICATION_NAME}:latest", "${env.DEV}/${params.APPLICATION_NAME}:latest")
                echo "Deployed in DEV environment!"
              } else {
                echo "Skipping DEV environment deployment due to conditions!"
              }
            }
          }
        }
      }
    }

    stage('Promote to Stage') {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              if (DEPLOY_TO == 'stage' || DEPLOY_TO == 'prod') {
                openshift.tag("${env.DEV}/${params.APPLICATION_NAME}:latest", "${env.STAGE}/${params.APPLICATION_NAME}:latest")
                echo "Deployed in STAGE environment!"
              } else {
                echo "Skipping STAGE environment deployment due to conditions!"
              }
            }
          }
        }
      }
    }

    stage('Promotion gate') {
      steps {
        script {
          if (DEPLOY_TO == 'prod') {
            input message: "Promote application to Production ${params.BLUE_GREEN} environment!"
          }
        }
      }
    }

    stage('Promote to Prod') {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              if (DEPLOY_TO == 'prod') {
                openshift.tag("${env.STAGE}/${params.APPLICATION_NAME}:latest", "${env.PROD}/${params.APPLICATION_NAME}-${params.BLUE_GREEN}:latest")
                echo "Deployed in PROD ${params.BLUE_GREEN} environment!"
              } else {
                echo "Skipping PROD environment deployment due to conditions!"
              }
            }
          }
        }
      }
    }
  }
}