# Deployment Guide

## AWS Setup

1. Launch EC2 Instance
   - Use Amazon Linux 2 AMI
   - Recommended: t2.small or larger
   - Configure Security Group:
     - Allow SSH (Port 22)
     - Allow HTTP (Port 80)
     - Allow HTTPS (Port 443)
     - Allow PostgreSQL (Port 5432) from within VPC

2. Configure DNS
   - Allocate Elastic IP
   - Associate with EC2 instance
   - Update domain DNS to point to Elastic IP

3. Initial Server Setup
```bash
# SSH into your instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Run setup script
chmod +x setup-ec2.sh
./setup-ec2.sh
```

4. SSL Certificate Setup
```bash
# Install certbot
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/ec2-user/blog-platform/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/ec2-user/blog-platform/nginx/ssl/
```

5. Deploy Application
```bash
# Clone repository
git clone your-repository-url
cd blog-platform

# Copy production environment file
cp .env.production .env

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

### SSL Certificate Renewal
```bash
# Renew certificates
sudo certbot renew

# Copy new certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/ec2-user/blog-platform/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/ec2-user/blog-platform/nginx/ssl/

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Monitoring
- Use AWS CloudWatch for monitoring
- Set up log rotation for Docker containers
- Monitor disk usage and database performance

## Troubleshooting

### Common Issues

1. Connection Issues
```bash
# Check service status
docker-compose -f docker-compose.prod.yml ps

# View service logs
docker-compose -f docker-compose.prod.yml logs service-name
```

2. Database Issues
```bash
# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Connect to database
docker exec -it postgres psql -U blogadmin -d blog_platform
```

3. nginx Issues
```bash
# Check nginx configuration
docker exec nginx nginx -t

# Check nginx logs
docker-compose -f docker-compose.prod.yml logs nginx
```