pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // NodeJS tool defined in Jenkins Global Tool Configuration
    }
    environment {
        PATH = "${env.PATH}:/opt/homebrew/bin/" // Adjust PATH if needed
        HEROKU_API_KEY = credentials('heroku-api-key')  // Your Heroku API key
        HEROKU_APP_STAGING = 'simpleweb-stagging'
        HEROKU_APP_PRODUCTION = 'simpleweb-production'
        DATADOG_API_KEY = credentials('datadog-api-key') // Store your Datadog API key securely in Jenkins credentials
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/namquang2910/sit223_HD.git', branch: 'main'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'  // Install Node.js dependencies
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'  // Run Webpack to build the project
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true  // Archive build artifacts
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'  // Run tests
            }
        }
        stage('Deploy to Staging') {
            steps {
                sh """
                heroku git:remote -a ${HEROKU_APP_STAGING}
                git push heroku main --force
                """
            }
        }
        stage('Deploy to Production') {
            steps {
                sh """
                heroku git:remote -a ${HEROKU_APP_PRODUCTION}
                
                git push heroku main --force
                """
            }
            post {
                success {
                    echo 'Deployment was successful!'
                }
                failure {
                    echo 'Deployment failed.'
                }  
            }
        }
        stage('Monitor Deployment') {
            steps {
                sh """
                heroku labs:enable runtime-dyno-metadata -a ${HEROKU_APP_PRODUCTION}
                heroku buildpacks:add https://github.com/DataDog/heroku-buildpack-datadog.git
                heroku config:add DD_AGENT_MAJOR_VERSION=7
                heroku config:add DD_API_KEY=${DATADOG_API_KEY}
                heroku config:add DD_SITE=us5.datadoghq.com
                heroku restart -a ${HEROKU_APP_PRODUCTION}
                """
                script {
                    def response = httpRequest "https:///simpleweb-production-38a2f21a4cd2.herokuapp.com"
                    if (response.status == 200) {
                        echo 'The application is up and running!'
                    } else {
                        error 'The application is not responding.'
                    }
                }
            }
        }
    }
    
}
