# ssl_setup.sh
#!/bin/bash

# SSL Setup Script for AI Chatbot SaaS Platform

# Configuration
DOMAIN="yourdomain.com"
EMAIL="admin@yourdomain.com"
DOCKER_COMPOSE_FILE="docker/docker-compose.yml"
NGINX_CONF_DIR="docker/nginx"

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Install certbot if not already installed
if ! command -v certbot &> /dev/null
then
    echo "Installing certbot..."
    apt-get update
    apt-get install -y certbot
fi

# Stop nginx service if running
docker-compose -f $DOCKER_COMPOSE_FILE stop frontend

# Generate SSL certificates
echo "Generating SSL certificates for $DOMAIN..."
certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos -m $EMAIL

# Create directory for SSL certificates
mkdir -p $NGINX_CONF_DIR/ssl

# Copy certificates to nginx directory
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $NGINX_CONF_DIR/ssl/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $NGINX_CONF_DIR/ssl/

# Update nginx configuration for HTTPS
sed -i "s/listen 80;/listen 443 ssl;/" $NGINX_CONF_DIR/nginx.conf
sed -i "/server_name localhost;/a \\    ssl_certificate /etc/nginx/ssl/fullchain.pem;\n    ssl_certificate_key /etc/nginx/ssl/privkey.pem;" $NGINX_CONF_DIR/nginx.conf

# Add HTTP to HTTPS redirect
echo "server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}" >> $NGINX_CONF_DIR/nginx.conf

# Add SSL configuration
echo "ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;" >> $NGINX_CONF_DIR/nginx.conf

# Restart services
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Setup auto-renewal
echo "0 0 * * * root /usr/bin/certbot renew --quiet && docker-compose -f $DOCKER_COMPOSE_FILE exec frontend nginx -s reload" >> /etc/crontab

echo "SSL setup completed successfully for $DOMAIN!"