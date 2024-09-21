pipeline {
    agent any
        tools {
        nodejs 'NodeJS' // The name you provided in Jenkins Global Tool Configuration
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                // Run Webpack to build the project
                sh 'npm run build'
                // Archive build artifacts for further use or deployment
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }
        stage('Test') {
            steps {
                // Run Webpack to build the project
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // Build Docker image
                    sh 'docker-compose build'
                    // Deploy using Docker Compose
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        always {
            // Clean up after deployment (optional)
            sh 'docker-compose down'
        }
    }
}