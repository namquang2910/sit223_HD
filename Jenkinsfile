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
        stage('Code Quality Checkk')
        {
            environment {
                scannerHome = tool 'sonar'
            }
            steps {
                withSonarQubeEnv('sonar') {
                    sh '${scannerHome}/bin/sonar-scanner -X'
            }
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
                script{
                sh'heroku labs:enable runtime-dyno-metadata -a ${HEROKU_APP_PRODUCTION}'
                def buildpackList = sh(script: 'heroku buildpacks --app ${HEROKU_APP_PRODUCTION}', returnStdout: true).trim()
                echo "Current Buildpacks: ${buildpackList}"
                
                // Check for the Datadog buildpack
                if (buildpackList.contains("DataDog/heroku-buildpack-datadog.git")) {
                    echo "Datadog buildpack is already installed."
                } else {
                    echo "Datadog buildpack is not installed."
                    sh """
                    heroku buildpacks:add https://github.com/DataDog/heroku-buildpack-datadog.git
                    heroku config:add DD_AGENT_MAJOR_VERSION=7
                    heroku config:add DD_API_KEY=${DATADOG_API_KEY}
                    heroku config:add DD_SITE=us5.datadoghq.com
                    """
                }
                sh 'heroku restart --app ${HEROKU_APP_PRODUCTION} '
                }
            }
        }
    }
}
