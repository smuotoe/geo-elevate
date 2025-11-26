# GeoElevate 🌍

A competitive geography learning game where players identify countries and capitals to climb the global leaderboard.

## Features

- **Interactive Learning**: Identify countries and capitals with real-time feedback
- **Global Leaderboard**: Compete with players worldwide
- **User Accounts**: Track your progress and achievements
- **Guest Mode**: Play without creating an account
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- TailwindCSS
- Framer Motion

**Backend:**
- FastAPI (Python)
- SQLite
- JWT Authentication

**Deployment:**
- Docker & Docker Compose
- Nginx

## Quick Start

### Local Development

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

Access the app at `http://localhost:3000`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions, including:
- Git-based deployment workflow
- Unraid/NAS setup
- Cloudflare Tunnel configuration
- Production checklist

## License

MIT
