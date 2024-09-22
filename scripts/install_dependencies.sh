#!/bin/bash

# Update package lists
sudo apt-get update

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Create the deployment directory
sudo mkdir -p /var/www/myapp

# Navigate to the deployment directory
cd /var/www/myapp

# Install project dependencies
npm install
