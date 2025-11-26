# GeoElevate Backend

FastAPI backend for GeoElevate geography learning game.

## Setup

### Using uv (recommended)

```bash
# Install dependencies
uv pip install -r requirements.txt

# Run development server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

Create a `.env` file in the backend directory:

```
SECRET_KEY=your-secret-key-here-change-this-to-something-random
DATABASE_URL=sqlite:///./data/geoelevate.db
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app entry point
│   ├── config.py        # Configuration
│   ├── database.py      # Database setup
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── routers/         # API endpoints
│   └── utils/           # Utilities (auth, security)
├── data/                # SQLite database (created on first run)
├── pyproject.toml       # uv project configuration
└── requirements.txt     # Python dependencies
```
