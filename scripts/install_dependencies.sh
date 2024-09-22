# Update package lists for Amazon Linux
sudo yum update -y

sudo yum install -y nodejs npm

# Create the deployment directory if it doesn't exist
if [ ! -d "/var/www/myapp" ]; then
  sudo mkdir -p /var/www/myapp
fi
# Navigate to the deployment directory
cd /var/www/myapp
# Install project dependencies
npm install
