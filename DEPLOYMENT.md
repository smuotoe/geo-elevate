# GeoElevate - Deployment Guide

## Quick Start with Docker Compose

### Git-Based Deployment Workflow (Recommended)

This is the recommended workflow for deploying updates to your NAS server.

#### Initial Setup

**1. On Your Local Machine (Windows):**

```bash
# Initialize Git repository (if not already done)
cd c:\Users\Somto\.gemini\antigravity\scratch\geo-elevate
git init
git add .
git commit -m "Initial commit"

# Create a GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/geo-elevate.git
git branch -M main
git push -u origin main
```

**2. On Your NAS Server:**

```bash
# Clone the repository
cd /mnt/user/appdata
git clone https://github.com/YOUR_USERNAME/geo-elevate.git
cd geo-elevate

# Make deploy script executable
chmod +x deploy.sh

# Create .env file with your secrets
nano .env
# Add: SECRET_KEY=your-super-secret-key-change-this-in-production

# Run initial deployment
./deploy.sh
```

#### Regular Deployment Workflow

**On Your Local Machine:**

```bash
# Make your changes
# ...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

**On Your NAS Server:**

```bash
# SSH into your NAS
ssh root@192.168.2.44

# Navigate to project directory
cd /mnt/user/appdata/geo-elevate

# Run deployment script (pulls latest changes and rebuilds)
./deploy.sh
```

The `deploy.sh` script automatically:
- Pulls the latest changes from GitHub
- Stops existing containers
- Rebuilds containers with new code
- Starts the updated containers
- Shows container status

### Prerequisites
- Docker and Docker Compose installed
- Git installed on both local machine and NAS
- GitHub account (or other Git hosting)
- (Optional) Cloudflare Tunnel for external access

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
SECRET_KEY=your-super-secret-key-change-this-in-production
```

Generate a secure secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 2. Build and Run

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 4. Unraid Deployment

#### Option 1: Docker Compose (Recommended)

1. Install "Docker Compose Manager" plugin from Community Applications
2. Copy the project to `/mnt/user/appdata/geoelevate/`
3. Navigate to the directory in terminal
4. Run: `docker-compose up -d`

#### Option 2: Manual Docker Containers

**Backend Container:**
- Repository: `geoelevate-backend` (build from `./backend`)
- Port: `8000:8000`
- Volume: `/mnt/user/appdata/geoelevate/data:/app/data`
- Environment Variables:
  - `SECRET_KEY=your-secret-key`
  - `DATABASE_URL=sqlite:///./data/geoelevate.db`

**Frontend Container:**
- Repository: `geoelevate-frontend` (build from `.`)
- Port: `3000:80`
- Link to backend container

### 5. Cloudflare Tunnel Setup

Since you're using Cloudflare Tunnels, you don't need to expose ports publicly.

1. **Install cloudflared** on your Unraid server
2. **Create a tunnel**:
   ```bash
   cloudflared tunnel create geoelevate
   ```

3. **Configure the tunnel** (`~/.cloudflared/config.yml`):
   ```yaml
   tunnel: <tunnel-id>
   credentials-file: /root/.cloudflared/<tunnel-id>.json

   ingress:
     - hostname: geoelevate.yourdomain.com
       service: http://localhost:3000
     - service: http_status:404
   ```

4. **Route DNS**:
   ```bash
   cloudflared tunnel route dns geoelevate geoelevate.yourdomain.com
   ```

5. **Run the tunnel**:
   ```bash
   cloudflared tunnel run geoelevate
   ```

### 6. Database Backup

The SQLite database is stored in `./data/geoelevate.db`. To backup:

```bash
# Create backup
docker-compose exec backend sqlite3 /app/data/geoelevate.db ".backup '/app/data/backup.db'"

# Or copy the file directly
cp ./data/geoelevate.db ./data/backup-$(date +%Y%m%d).db
```

### 7. Updating the Application

**Using Git Workflow (Recommended):**

```bash
# On NAS, simply run the deployment script
./deploy.sh
```

**Manual Update:**

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d
```

### 8. Monitoring

```bash
# View logs
docker-compose logs -f

# Check container status
docker-compose ps

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend
```

## Production Checklist

- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Update `CORS_ORIGINS` to include your domain
- [ ] Set up regular database backups
- [ ] Configure Cloudflare Tunnel for external access
- [ ] Enable HTTPS (handled by Cloudflare)
- [ ] Monitor disk space for database growth
- [ ] Set up log rotation

## Troubleshooting

### Backend won't start
- Check logs: `docker-compose logs backend`
- Verify `SECRET_KEY` is set
- Ensure data directory has write permissions

### Frontend can't connect to backend
- Verify both containers are on the same network
- Check `VITE_API_URL` environment variable
- Ensure CORS_ORIGINS includes your frontend URL

### Database locked errors
- Stop all containers: `docker-compose down`
- Check for stale lock files in `./data/`
- Restart: `docker-compose up -d`

## Development Mode

To run in development mode with hot reload:

```bash
# Backend
cd backend
uv pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
npm install
npm run dev
```

## Support

For issues, check:
1. Container logs
2. Database file permissions
3. Network connectivity between containers
4. Environment variables are set correctly
