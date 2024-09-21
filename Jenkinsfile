pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // NodeJS tool defined in Jenkins Global Tool Configuration
    }
    environment {
        AWS_ACCESS_KEY_ID = credentials('Elastic-BeanTalk-cred')  // Jenkins AWS credentials ID
        AWS_SECRET_ACCESS_KEY = credentials('Elastic-BeanTalk-cred')  // Same as above
        S3_BUCKET = 'simpleweb-bucket'
        APPLICATION_NAME = 'simple-web'  // CodeDeploy application name
        DEPLOYMENT_GROUP_NAME = 'simpleWeb'  // CodeDeploy deployment group name
        DEPLOYMENT_CONFIG_NAME = 'CodeDeployDefault.AllAtOnce'  // Deployment configuration
        PATH = "${env.PATH}:/opt/homebrew/bin/" // Adjust PATH if needed
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
        stage('Package') {
            steps {
                // Create a ZIP file with the built application and required files
                sh 'zip -r myapp.zip dist/* appspec.yml script/* Procfile package.json'
                // Upload the ZIP file to S3
                sh 'aws s3 cp myapp.zip s3://$S3_BUCKET/myapp.zip'
            }
        }
        stage('Deploy to AWS CodeDeploy') {
            steps {
                // Deploy the application using AWS CodeDeploy
                step([$class: 'AWSCodeDeployPublisher',
                      applicationName: "${APPLICATION_NAME}",
                      deploymentGroupName: "${DEPLOYMENT_GROUP_NAME}",
                      deploymentConfig: "${DEPLOYMENT_CONFIG_NAME}",
                      s3bucket: "${S3_BUCKET}",
                      region: 'ap-southeast-2',  // Adjust the region as needed
                      waitForCompletion: true  // Wait for the deployment to complete
                ])
            }
        }
    }
}
