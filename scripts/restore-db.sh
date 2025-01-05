#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./restore-db.sh <backup-file>"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f ${BACKUP_FILE} ]; then
    echo "Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "Starting database restore..."
cat ${BACKUP_FILE} | docker exec -i postgres psql -U blogadmin blog_platform

if [ $? -eq 0 ]; then
    echo "Restore completed successfully"
else
    echo "Restore failed!"
    exit 1
fi 