// Jenkinsfile for NodeJS App - CI/CD
def templateName = 'weather-nodejs'

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
                        echo "Using project: ${openshift.project()}"
                        echo "APPLICATION_NAME: ${params.APPLICATION_NAME}"
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
              echo "In DEV stage from== ${env.BUILD}/${params.APPLICATION_NAME}:latest"
              echo "In DEV stage to== ${env.DEV}/${params.APPLICATION_NAME}:latest"
              openshift.tag("${env.BUILD}/${params.APPLICATION_NAME}:latest", "${env.DEV}/${params.APPLICATION_NAME}:latest")
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
              openshift.tag("${env.DEV}/${params.APPLICATION_NAME}:latest", "${env.STAGE}/${params.APPLICATION_NAME}:latest")
            }
          }
        }
      }
    }

    stage('Promotion gate') {
      steps {
        script {
          input message: "Promote application to Production ${params.BLUE_GREEN} environment!"
        }
      }
    }

    stage("Promote to Prod "${params.BLUE_GREEN}) {
      steps {
        script {
          openshift.withCluster() {
            openshift.withProject() {
              openshift.tag("${env.STAGE}/${params.APPLICATION_NAME}:latest", "${env.PROD}/${params.APPLICATION_NAME}-${params.BLUE_GREEN}:latest")
            }
          }
        }
      }
    }
  }
}