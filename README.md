# Muyai

AI-powered career development platform for African talent.

## Design

UI follows the [Tokko](https://tokko.framer.website/) visual language — vibrant pink/purple/blue palette, pill buttons, rounded cards, and bold typography. Applied across landing page, dashboard, and all app components.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MySQL

## Setup

### 1. Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Server

```bash
cd server
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs at `http://localhost:5173`

## Seed Users

All seed users use password: `Password123!`

| Email | Plan | Role |
|-------|------|------|
| admin@muyai.com | pro | admin |
| free@muyai.com | free | user |
| student@muyai.com | student | user |
| pro@muyai.com | pro | user |

## API Endpoints

### Auth (Phase 2)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Create account (defaults to free plan) |
| POST | `/api/auth/login` | Public | Login, returns JWT + user |
| GET | `/api/auth/me` | Bearer token | Current user profile |

### Resumes (Phase 3)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/resumes` | Bearer token | List user's resumes + scan count |
| POST | `/api/resumes/upload` | Bearer token | Upload PDF, AI skill extraction (free: max 2) |
| GET | `/api/resumes/:id/skills` | Bearer token | Skills for a resume |

Requires `CLAUDE_API_KEY` (or `OPENAI_API_KEY` with `AI_PROVIDER=openai`) for resume parsing.

### Analysis & Recommendations (Phase 4 — student+)

| Method | Endpoint | Plan | Description |
|--------|----------|------|-------------|
| GET | `/api/analysis/job-roles` | student+ | List target job roles |
| POST | `/api/analysis/gap` | student+ | Run AI gap analysis `{ resumeId, jobRoleId }` |
| GET | `/api/analysis/gaps/:resumeId` | student+ | Get saved gaps (optional `?jobRoleId=`) |
| GET | `/api/recommendations/:resumeId` | student+ | Career + course recommendations (cached) |
| POST | `/api/recommendations/:resumeId/refresh` | student+ | Regenerate recommendations |

## API Response Format

```json
{ "success": true, "data": {}, "error": null }
```
