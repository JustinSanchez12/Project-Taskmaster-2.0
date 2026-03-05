# Taskmaster 2.0

A calendar-based task manager. Click a date, add tasks, check them off.

## Quick Start

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
alembic upgrade head
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## Stack

- **Backend**: FastAPI + SQLAlchemy + SQLite (upgradeable to PostgreSQL via `DATABASE_URL` env var)
- **Frontend**: React + Vite + FullCalendar v6

## API

Base URL: `http://localhost:8000/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks?start_date=&end_date=` | List tasks in date range |
| POST | `/tasks` | Create task |
| GET | `/tasks/{id}` | Get task |
| PATCH | `/tasks/{id}` | Update task (partial) |
| DELETE | `/tasks/{id}` | Delete task |

Interactive docs: http://localhost:8000/docs
