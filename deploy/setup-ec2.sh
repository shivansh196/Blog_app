#!/bin/bash

# Update system packages
sudo yum update -y

# Install required packages
sudo yum install -y docker git curl

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /home/ec2-user/blog-platform
cd /home/ec2-user/blog-platform

# Create necessary directories
mkdir -p {logs,backups,nginx/ssl}

# Set up automatic security updates
sudo yum install -y yum-cron
sudo sed -i 's/apply_updates = no/apply_updates = yes/' /etc/yum/yum-cron.conf
sudo systemctl start yum-cron
sudo systemctl enable yum-cron

# Install monitoring tools
sudo amazon-linux-extras install -y nginx1
sudo yum install -y htop

# Set up log rotation
sudo tee /etc/logrotate.d/docker-containers <<EOF
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=50M
    missingok
    delaycompress
    copytruncate
}
EOF

echo "Setup completed successfully!"