# Taskmaster 2.0

### Objective

Taskmaster 2.0 is a calendar-based web application that allows users to create daily task, set priority of each task, and cross off task that are completed.

Phase 1: 
- Create a calendar-based task manager 
- Allow users to add, edit, set priority, and check off tasks

Phase 2:
- More in depth on task making (e.g. Time specific, etc.)
- Longer spanning task (multiple days)

Phase 3: 
- Agentic models to help setup and optimize task tracking and scheduling

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
