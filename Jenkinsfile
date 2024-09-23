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
                
                git push heroku main
                """
            }
            }
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
