# FixiFy Backend API

REST API backend for the FixiFy eco-city app.

## Features
- User authentication (Citizens, Municipality Workers, Admins)
- Trash Bin management and mapping
- Issue reporting with AI-powered verification (OpenAI GPT-4 Vision)
- Task management and assignment for municipality workers
- Green Coin rewards system and QR code spending
- Route optimization for garbage trucks (Google Maps Directions)

## Setup
1. Create a virtual environment: `python -m venv venv`
2. Activate it: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and fill in your keys (PostgreSQL, OpenAI, AWS S3, Google Maps).
5. Initialize the database with Alembic: `alembic upgrade head`
6. Run the server: `uvicorn app.main:app --reload`

## API Endpoints
- `/docs` - Swagger UI for exploring all endpoints
- `/auth/...` - Registration, login
- `/reports/...` - Submit photos, view reports
- `/tasks/...` - Assign and resolve municipality tasks
- `/bins/...` - Map locations, status updates
- `/coins/...` - Wallet, QR payments, leaderboard
- `/truck-routes/optimize` - AI route calculation

## Tech Stack
- Python 3.11+
- FastAPI
- SQLAlchemy + PostgreSQL
- Alembic (Migrations)
- OpenAI API (Vision)
- AWS S3 (Image Storage)
- Google Maps API (Routing)
