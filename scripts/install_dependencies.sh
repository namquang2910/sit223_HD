#!/bin/bash

# Update package lists for Amazon Linux
sudo yum update -y
sudo yum install -y nodejs unzip

# Create the deployment directory if it doesn't exist
if [ ! -d "/var/www/myapp" ]; then
  sudo mkdir -p /var/www/myapp
fi

# Clean up any previous failed installations
if [ -d "node_modules" ]; then
  sudo rm -rf node_modules
fi

# Install project dependencies
if [ -f "package.json" ]; then
  npm install
else
  echo "Error: package.json not found!"
  exit 1
fi
