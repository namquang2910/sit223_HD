#!/bin/bash

# Navigate to the application directory
cd /var/www/myapp/dist

pm2 start npm --name "app name" -- start

