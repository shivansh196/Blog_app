#!/bin/bash

# Check if services are running
echo "Checking service status..."
docker-compose -f docker-compose.prod.yml ps

# Test endpoints
echo -e "\nTesting endpoints..."
curl -s http://localhost:3002/health
curl -s http://localhost:3003/health
curl -s http://localhost:3004/health

# Check database connection
echo -e "\nTesting database connection..."
docker exec postgres pg_isready -U ${DB_USER} -d ${DB_NAME}

# Check logs for errors
echo -e "\nChecking for errors in logs..."
docker-compose -f docker-compose.prod.yml logs --tail=100 | grep -i error

echo -e "\nDeployment verification complete!" 