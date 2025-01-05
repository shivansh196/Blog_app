#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.sql"

mkdir -p ${BACKUP_DIR}

echo "Starting database backup..."
docker exec postgres pg_dump -U blogadmin blog_platform > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo "Backup completed successfully: ${BACKUP_FILE}"
else
    echo "Backup failed!"
    exit 1
fi 