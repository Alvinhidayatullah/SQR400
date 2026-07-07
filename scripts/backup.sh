#!/bin/bash
# Backup script for SQR400 PostgreSQL database

# Variables
CONTAINER_NAME="sqr400_postgres"
DB_USER="postgres"
DB_NAME="sqr400"
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup of $DB_NAME database..."

# Run pg_dump inside the docker container
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup successfully completed: $BACKUP_FILE"
  # Compress the backup
  gzip "$BACKUP_FILE"
  echo "Backup compressed: ${BACKUP_FILE}.gz"
else
  echo "Error during database backup!"
  rm -f "$BACKUP_FILE"
  exit 1
fi
