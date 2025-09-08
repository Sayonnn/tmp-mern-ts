#!/bin/bash
# scripts/refresh_seed.sh

# Name of your Postgres container (must match docker-compose.yml)
APP_NAME="speedmate"  
DB_ABBR="spm"
CONTAINER_NAME=db_${APP_NAME}
DB_USER=${APP_NAME}
DB_NAME=db_${APP_NAME}
DB_PASSWORD=${APP_NAME}19!

#OUTPUT FILE
OUTPUT_FILE=./scripts/init/${APP_NAME}.sql

echo "📦 Exporting database '$DB_NAME' from container '$CONTAINER_NAME'..."

docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $OUTPUT_FILE

if [ $? -eq 0 ]; then
  echo "✅ Database exported successfully to $OUTPUT_FILE"
else
  echo "❌ Failed to export database"
fi
