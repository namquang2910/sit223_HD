#!/bin/bash
export HOME=/home/ssm-user  # Change this to the actual user’s home directory

# Update package lists for Amazon Linux
sudo yum update -y
sudo yum install -y nodejs

cd /var/www/myapp
pwd
npm install
npm install -g pm2
npm install -g http-server

