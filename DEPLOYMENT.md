# AWS Deployment Guide

## AWS Services Used

1. EC2 Instance
   - Region: eu-north-1 (Stockholm)
   - Instance Type: t3.micro
   - AMI: Amazon Linux 2
   - Public IP: 13.61.101.92
   - DNS: ec2-13-61-101-92.eu-north-1.compute.amazonaws.com

2. Security Group Configuration
   ```
   Inbound Rules:
   - HTTP (80): 0.0.0.0/0
   - SSH (22): Your IP
   - PostgreSQL (5432): Internal VPC
   ```

## Deployment Steps

1. EC2 Setup
```bash
# SSH into instance
ssh -i your-key.pem ec2-user@13.61.101.92

# Install dependencies
sudo yum update -y
sudo yum install -y docker git
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. Application Deployment
```bash
# Clone repository
git clone [repository-url]
cd blog-platform

# Set up environment
cp .env.production .env

# Deploy services
docker-compose -f docker-compose.prod.yml up -d
```

## Verification Steps

1. Check Services
```bash
# Verify all containers are running
docker ps

# Check service logs
docker-compose -f docker-compose.prod.yml logs
```

2. Test Endpoints
```bash
# Health checks
curl http://13.61.101.92/health

# API endpoints
curl http://13.61.101.92/blogs
curl http://13.61.101.92/comments
```

## Monitoring

1. Resource Usage
```bash
# Check CPU and memory
docker stats

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

2. Database Backups
```bash
# Create backup
./scripts/backup-db.sh

# Restore if needed
./scripts/restore-db.sh backup.sql
```

## Troubleshooting

1. Container Issues
```bash
# Restart services
docker-compose -f docker-compose.prod.yml restart

# Check container logs
docker logs [container_id]
```

2. Network Issues
```bash
# Check security group
aws ec2 describe-security-groups

# Test database connection
docker exec postgres pg_isready
```