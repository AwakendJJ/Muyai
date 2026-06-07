# Muyai

AI-powered career development platform for African talent.

## Design

UI follows the [Tokko](https://tokko.framer.website/) visual language — vibrant pink/purple/blue palette, pill buttons, rounded cards, and bold typography across landing page, sidebar dashboard, and all app components.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Recharts
- **Backend:** Node.js + Express
- **Database:** MySQL
- **AI:** Claude API (default) or OpenAI-compatible APIs

## Prerequisites

- Node.js 18+
- MySQL 8+
- Claude API key (or OpenAI API key)

## Quick Start

### 1. Database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Server

```bash
cd server
cp .env.example .env
```

Edit `.env` with your credentials:

```
CLAUDE_API_KEY=your-key-here
JWT_SECRET=your-secret-here
DB_HOST=localhost
DB_USER=root
DB_PASS=your-password
DB_NAME=muyai
```

```bash
npm install
npm run dev
```

Server: `http://localhost:5000`

### 3. Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client: `http://localhost:5173`

## Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Tokko-style landing page |
| `/register` | Public | Create account |
| `/login` | Public | Sign in |
| `/dashboard` | Auth | Stats, skill chart, quick actions |
| `/resume` | Auth | Upload PDF, view extracted skills |
| `/analysis` | Student+ | Gap analysis with bar chart |
| `/recommendations` | Student+ | Career paths + courses |
| `/admin` | Admin | Users table, AI usage, plan donut chart |

## Seed Users

Password for all: `Password123!`

| Email | Plan | Role |
|-------|------|------|
| admin@muyai.com | pro | admin |
| free@muyai.com | free | user |
| student@muyai.com | student | user |
| pro@muyai.com | pro | user |

## Plan Tiers

| Plan | Features |
|------|----------|
| **Free** | 2 resume scans, basic skill report |
| **Student** | Unlimited scans, gap analysis, recommendations |
| **Pro** | Everything in Student + job matching, cover letters, tracker (Phase 2) |

## API Endpoints

### Auth
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Current user (Bearer token)

### Resumes
- `GET /api/resumes` — List resumes + scan count
- `POST /api/resumes/upload` — Upload PDF, AI skill extraction
- `GET /api/resumes/:id/skills` — Skills for a resume

### Analysis (student+)
- `GET /api/analysis/job-roles` — Target job roles
- `POST /api/analysis/gap` — Run gap analysis `{ resumeId, jobRoleId }`
- `GET /api/analysis/gaps/:resumeId` — Saved gaps

### Recommendations (student+)
- `GET /api/recommendations/:resumeId` — Career + course recs (cached)
- `POST /api/recommendations/:resumeId/refresh` — Regenerate

### Admin (admin only)
- `GET /api/admin/users` — Users + plan distribution
- `GET /api/admin/usage` — AI usage summary

### Health
- `GET /api/health` — Server + DB status

## Response Format

```json
{ "success": true, "data": {}, "error": null }
```

## Project Structure

```
/client          React frontend
/server
  /routes        Express route modules
  /controllers   Request handlers
  /middleware    auth, plan, admin guards
  /services      ai.service.js (all AI calls)
  /models        Database access
/database
  schema.sql     MySQL tables
  seed.sql       Test users + job roles
```

## Environment Variables

**Server** (`server/.env`):

| Variable | Description |
|----------|-------------|
| `CLAUDE_API_KEY` | Anthropic API key |
| `OPENAI_API_KEY` | OpenAI key (if using openai provider) |
| `JWT_SECRET` | JWT signing secret |
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL user |
| `DB_PASS` | MySQL password |
| `DB_NAME` | Database name (muyai) |
| `AI_PROVIDER` | `claude` or `openai` |
| `AI_MODEL` | Model name |
| `PORT` | Server port (5000) |

**Client** (`client/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (`http://localhost:5000/api`) |

## Production Build

```bash
cd client && npm run build
cd server && npm start
```

Serve `client/dist` via your preferred static host or proxy through Express.
