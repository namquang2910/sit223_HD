#!/bin/bash

# Navigate to the application directory
cd /var/www/myapp

pm2 start http-server -- -p 8080 dist

