pipeline {
    agent any


    stages {
        stage('Install Dependencies') {
            steps {
                // Install npm packages
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
    }

    post {
        always {
            // Clean up after the build process
            cleanWs()
        }
    }
}
