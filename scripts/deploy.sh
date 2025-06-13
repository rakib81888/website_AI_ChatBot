# deploy.sh
#!/bin/bash

# Deployment script for AI Chatbot SaaS Platform

# Load environment variables
set -a
source .env
set +a

# Configuration
DOCKER_COMPOSE_FILE="docker/docker-compose.yml"
GIT_REPO="https://github.com/yourusername/chatbot-saas.git"
TEMP_DIR="/tmp/chatbot-deploy"
BACKUP_DIR="/backup/chatbot/$(date +%Y%m%d_%H%M%S)"

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Create backup directory
mkdir -p $BACKUP_DIR

# Step 1: Stop and backup existing services
echo "Stopping services and creating backup..."
docker-compose -f $DOCKER_COMPOSE_FILE down
docker-compose -f $DOCKER_COMPOSE_FILE exec db pg_dump -U user chatbot > $BACKUP_DIR/db_backup.sql
cp -r data $BACKUP_DIR

# Step 2: Update codebase
echo "Updating codebase..."
mkdir -p $TEMP_DIR
git clone $GIT_REPO $TEMP_DIR

# Step 3: Copy updated files
echo "Copying updated files..."
cp -r $TEMP_DIR/backend ./backend
cp -r $TEMP_DIR/frontend ./frontend
cp -r $TEMP_DIR/docker ./docker
cp -r $TEMP_DIR/scripts ./scripts
cp $TEMP_DIR/.env .env

# Step 4: Rebuild and start services
echo "Rebuilding and starting services..."
docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Step 5: Run database migrations
echo "Running database migrations..."
docker-compose -f $DOCKER_COMPOSE_FILE exec backend alembic upgrade head

# Step 6: Cleanup
echo "Cleaning up..."
rm -rf $TEMP_DIR

echo "Deployment completed successfully!"
echo "Backup created at: $BACKUP_DIR"