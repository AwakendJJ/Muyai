# Muyai

AI-powered career development platform for African talent.

## Design

UI follows the [Tokko](https://tokko.framer.website/) visual language — vibrant pink/purple/blue palette, pill buttons, rounded cards, and bold typography.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Recharts
- **Backend:** Node.js + Express
- **Database:** [Supabase](https://supabase.com) (PostgreSQL)
- **AI:** Claude API (default) or OpenAI-compatible APIs

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)
- AI API key: Claude, OpenAI, or [DeepSeek](https://platform.deepseek.com) (for resume upload / AI features)

---

## Setup Guide (Supabase)

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose an organization, name it `muyai`, set a database password, pick a region
4. Wait for the project to finish provisioning (~2 min)

### Step 2 — Run the database schema

1. In your Supabase dashboard, open **SQL Editor**
2. Click **New query**
3. Copy the entire contents of [`database/schema.sql`](database/schema.sql) and paste it in
4. Click **Run** — you should see "Success. No rows returned"
5. Open **Table Editor** — confirm these tables exist:
   - `users`, `resumes`, `skills`, `job_roles`, `skill_gaps`, `recommendations`, `ai_usage`

### Step 3 — Seed test data

1. In **SQL Editor**, open a new query
2. Copy the entire contents of [`database/seed.sql`](database/seed.sql) and run it
3. In **Table Editor → users**, confirm 4 seed users appear
4. In **Table Editor → job_roles**, confirm 5 roles appear

> Only run `seed.sql` once. Running it again is safe for users (emails conflict-skip) but will duplicate job roles.

### Step 4 — Get your Supabase credentials

1. In Supabase dashboard, go to **Project Settings → API**
2. Copy these values:

| Setting | Where to find it | Used as |
|---------|------------------|---------|
| Project URL | `URL` field | `SUPABASE_URL` |
| service_role key | `service_role` under Project API keys | `SUPABASE_SERVICE_ROLE_KEY` |

> Use the **service_role** key on the server only — never expose it in the frontend or commit it to git.

### Step 5 — Configure the server

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
JWT_SECRET=any-long-random-string
DEEPSEEK_API_KEY=sk-...       # if using DeepSeek
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
PORT=5000
```

```bash
npm install
npm run dev
```

**Expected output:**
```
Database connected
Muyai server running on http://localhost:5000
```

**Verify:** Open `http://localhost:5000/api/health`

```json
{ "success": true, "data": { "status": "ok", "database": "connected" }, "error": null }
```

### Step 6 — Configure and start the client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Verification Checklist

### Database
- [ ] All 7 tables visible in Supabase Table Editor
- [ ] 4 seed users in `users` table
- [ ] 5 job roles in `job_roles` table
- [ ] `/api/health` returns `"database": "connected"`

### Auth
- [ ] Login with `student@muyai.com` / `Password123!` → lands on dashboard
- [ ] Register new account works
- [ ] `/dashboard` redirects to `/login` when logged out

### Resume (needs `CLAUDE_API_KEY`)
- [ ] Upload PDF at `/resume` → skills extracted
- [ ] Dashboard shows skill donut chart
- [ ] Free user blocked after 2 uploads

### Analysis (student+)
- [ ] Login as `student@muyai.com`
- [ ] `/analysis` → run gap analysis → bar chart + missing skills
- [ ] Free user sees upgrade banner on `/analysis`

### Recommendations (student+)
- [ ] `/recommendations` shows career paths + courses after gap analysis

### Admin
- [ ] Login as `admin@muyai.com` → `/admin` shows users + AI usage
- [ ] Non-admin redirected from `/admin`

---

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
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Resumes
- `GET /api/resumes`
- `POST /api/resumes/upload`
- `GET /api/resumes/:id/skills`

### Analysis (student+)
- `GET /api/analysis/job-roles`
- `POST /api/analysis/gap`
- `GET /api/analysis/gaps/:resumeId`

### Recommendations (student+)
- `GET /api/recommendations/:resumeId`
- `POST /api/recommendations/:resumeId/refresh`

### Admin (admin only)
- `GET /api/admin/users`
- `GET /api/admin/usage`

### Health
- `GET /api/health`

## Pages

| Route | Access |
|-------|--------|
| `/` | Public landing page |
| `/register`, `/login` | Public |
| `/dashboard` | Authenticated |
| `/resume` | Authenticated |
| `/analysis` | Student+ |
| `/recommendations` | Student+ |
| `/admin` | Admin only |

## Environment Variables

**Server** (`server/.env`):

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side key (bypasses RLS) |
| `JWT_SECRET` | JWT signing secret |
| `CLAUDE_API_KEY` | Anthropic API key (if `AI_PROVIDER=claude`) |
| `OPENAI_API_KEY` | OpenAI key (if `AI_PROVIDER=openai`) |
| `DEEPSEEK_API_KEY` | DeepSeek key (if `AI_PROVIDER=deepseek`) |
| `AI_PROVIDER` | `claude`, `openai`, or `deepseek` |
| `AI_MODEL` | e.g. `deepseek-chat`, `claude-sonnet-4-20250514`, `gpt-4o` |
| `PORT` | Server port (5000) |

**Client** (`client/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Database connection failed` on `/api/health` | Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env` |
| `relation "users" does not exist` | Run `database/schema.sql` in Supabase SQL Editor |
| `Invalid API key` from Supabase | Use **service_role** key, not the `anon` key |
| `CLAUDE_API_KEY is not configured` | Set `AI_PROVIDER=deepseek` + `DEEPSEEK_API_KEY`, or add Claude key |
| `DEEPSEEK_API_KEY is not configured` | Add DeepSeek key to `.env`, restart server |
| Login fails for seed users | Run `database/seed.sql` in Supabase SQL Editor |
| Duplicate job roles | Only run seed once, or delete rows from `job_roles` before re-seeding |

## Project Structure

```
/client          React frontend
/server
  /config        Supabase client (db.js)
  /routes        Express routes
  /controllers   Request handlers
  /middleware    auth, plan, admin guards
  /services      ai.service.js
  /models        Supabase data access
/database
  schema.sql     PostgreSQL schema for Supabase
  seed.sql       Test users + job roles
```

## Production Build

```bash
cd client && npm run build
cd server && npm start
```
