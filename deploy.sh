#!/bin/bash

# GeoElevate Deployment Script for NAS
# This script pulls the latest changes from GitHub and rebuilds the containers

set -e  # Exit on error

echo "🚀 Starting GeoElevate deployment..."

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Rebuild and start containers
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait a moment for containers to start
sleep 3

# Show container status
echo "✅ Deployment complete! Container status:"
docker-compose ps

echo ""
echo "📋 To view logs, run:"
echo "  docker logs -f geoelevate-frontend"
echo "  docker logs -f geoelevate-backend"
