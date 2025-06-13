# celery_worker.sh
#!/bin/bash

# Celery Worker Script for AI Chatbot SaaS Platform

# Load environment variables
set -a
source .env
set +a

# Configuration
APP_NAME="main"
WORKER_NAME="chatbot-worker-%h"
CONCURRENCY=4
LOG_LEVEL="info"
LOG_FILE="/var/log/celery/worker.log"

# Create log directory
mkdir -p $(dirname $LOG_FILE)

# Start Celery worker
echo "Starting Celery worker..."
celery -A $APP_NAME worker \
  --hostname=$WORKER_NAME \
  --concurrency=$CONCURRENCY \
  --loglevel=$LOG_LEVEL \
  --logfile=$LOG_FILE \
  --events \
  --autoscale=10,3 \
  --time-limit=300 \
  --pidfile=/tmp/celery_worker.pid