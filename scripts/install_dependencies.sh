#!/bin/bash

# Update package lists for Amazon Linux
sudo yum update -y
sudo yum install -y nodejs

cd /var/www/myapp
pwd
npm install

