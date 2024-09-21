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
     

        stage('Package') {
            steps {
                script {
                    // Zip the build output (dist folder)
                    sh 'zip -r dist.zip dist/'
                }
            }
        }
        stage('Deploy to AWSElasticBeanstalk') {
            environment {
                AWS_DEFAULT_REGION = 'ap-southeast-2'
                ENV_NAME = 'Simple-web-sit223-env'
                APP_NAME = 'simple-web-sit223'
            }
            steps {
                 script {
                    step([$class: 'AWSEBDeploymentBuilder',
                            credentialId: 'Elastic-BeanTalk-cred', // Replace with your credential ID
                            awsRegion: 'ap-southeast-2', // Replace with your desired region
                            applicationName: 'simple-web-sit223', // Replace with your app name
                            environmentName: 'Simple-web-sit223-env', // Replace with your environment name
                            rootObject: 'dist.zip', // Optional, for web apps
                            versionLabelFormat: "-${BUILD_NUMBER}" // Version label format
                    ])
                    }   
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
