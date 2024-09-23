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
                git checkout -b main
                heroku git:remote -a ${HEROKU_APP_STAGING}
                git add .
                git commit -m "Deploy to staging"
                git push heroku main
                """
            }
        }
        stage('Deploy to Production') {
            steps {
                input 'Approve deployment to production?'  // Manual approval step
                sh """
                git checkout -b main
                heroku git:remote -a ${HEROKU_APP_PRODUCTION}
                git add .
                git commit -m "Deploy to production"
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
