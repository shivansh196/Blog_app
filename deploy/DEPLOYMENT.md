# Deployment Guide

## Prerequisites
- AWS Account with EC2 access
- Docker and Docker Compose installed
- Node.js 18+ (for local development)

## AWS Setup

1. Launch EC2 Instance
   - Use Amazon Linux 2 AMI
   - Configure Security Group:
     - Allow SSH (Port 22)
     - Allow HTTP (Port 80)
     - Allow PostgreSQL (Port 5432) from within VPC

2. Initial Server Setup
```bash
# SSH into your instance
ssh -i your-key.pem ec2-user@13.61.101.92

# Install Docker and Docker Compose
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. Deploy Application
```bash
# Clone repository
git clone [repository-url]
cd blog-platform

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Maintenance

### Database Backup
```bash
# Backup
docker exec postgres pg_dump -U blogadmin blog_platform > backup.sql

# Restore
cat backup.sql | docker exec -i postgres psql -U blogadmin blog_platform
```

### Monitoring
- Check service logs: `docker-compose logs [service-name]`
- Monitor system resources: `htop`
- Check database status: `docker exec postgres pg_isready`