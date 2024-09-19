pipeline {
    agent any


    stages {
        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                script {
                    // Set Node.js version
                    def nodeVersion = tool name: 14, type: 'NodeJSInstallation'
                    env.PATH = "${nodeVersion}/bin:${env.PATH}"
                }
                
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

        stage('Archive Artifacts') {
            steps {

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
