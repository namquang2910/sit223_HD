#!/bin/bash

# Navigate to the application directory
cd /var/www/myapp

# Start your server (adjust this command based on your setup)
# For example, using Node.js:
node start server.js  # or any command you use to run your application

# Ensure that the server is started properly
pm2 save
