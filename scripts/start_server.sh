#!/bin/bash
export HOME=/home/ec2-user  # Change this to the actual user’s home directory

# Navigate to the application directory
cd /var/www/myapp
pm2 kill
pm2 start npm --name "deloy" -- start
pm2 status
exit 1
