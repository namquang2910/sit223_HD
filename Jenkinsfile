pipeline {
    agent any
    tools {
        nodejs 'NodeJS' // NodeJS tool defined in Jenkins Global Tool Configuration
    }
    environment {
        AWS_ACCESS_KEY_ID = credentials('Elastic-BeanTalk-cred')  // Use the ID of your AWS credentials
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
                sh 'zip -r myapp.zip dist/* appspec.yml scripts/* Procfile package.json server.js'
                // Upload the ZIP file to S3
                sh 'aws s3 cp myapp.zip s3://$S3_BUCKET/myapp.zip'
            }
        }
        stage('Deploy to AWS CodeDeploy') {
            steps {
                  sh '''
                aws deploy create-deployment --application-name simple-web \
                --deployment-group-name simpleWeb \
                --ignore-application-stop-failures \
                --s3-location bucket=simpleweb-bucket,key=myapp.zip,bundleType=zip \
                --region ap-southeast-2
                '''
            }
        }
    }
}
