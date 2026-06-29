# Deploy Muyai — Vercel (frontend) + Render (backend)

## Prerequisites

- GitHub repo pushed: `https://github.com/AwakendJJ/Muyai`
- Supabase schema applied (`database/schema.sql`)
- Firebase project with Email/Password auth enabled
- Firebase service account JSON values for the server

---

## Step 1 — Deploy backend on Render

1. Go to [render.com](https://render.com) → **Sign in with GitHub**
2. **New +** → **Blueprint** (uses `render.yaml`) **or** **Web Service** (manual)
3. Connect repository **AwakendJJ/Muyai**

### Manual web service settings

| Setting | Value |
|---------|--------|
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

### Environment variables (Render dashboard)

**Supabase belongs here on Render — not on Vercel.** Vercel only needs `VITE_*` variables.

Copy from your local `server/.env`:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=   # paste with \n for line breaks
AI_PROVIDER=deepseek
AI_MODEL=deepseek-chat
DEEPSEEK_API_KEY=       # or CLAUDE_API_KEY / OPENAI_API_KEY
PLAN_GATING_ENABLED=false
JOBS_DEFAULT_COUNTRY=remote
FRONTEND_URL=https://muyai.vercel.app
```

4. Deploy and note your API URL, e.g. `https://muyai.onrender.com`
5. Test: `https://muyai.onrender.com/api/health` (must return `"status":"ok"`)

---

## Step 2 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import **AwakendJJ/Muyai**
2. **Important:** set **Root Directory** to exactly `client` — no leading/trailing spaces (a common error is `client ` which fails the build).

| Setting | Value |
|--------|--------|
| Root Directory | `client` |
| Framework Preset | Vite |
| Build Command | `npm run build` (default) |
| Output Directory | `dist` (default) |
| Install Command | `npm install` (default) |

Do **not** use `npm install --prefix client` when Root Directory is already `client`.

`client/vercel.json` handles SPA rewrites for React Router.

3. **Environment variables** (Production):

```
VITE_API_URL=https://muyai.onrender.com/api
```

**Must include `/api` at the end.** Example: `https://muyai.onrender.com/api` (not just `https://muyai.onrender.com`).

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_PLAN_GATING_ENABLED=false
```

4. Deploy → note URL, e.g. `https://muyai.vercel.app`

---

## Step 3 — Connect frontend ↔ backend

1. In **Render**, set `FRONTEND_URL` to your Vercel URL (no trailing slash):
   ```
   FRONTEND_URL=https://muyai.vercel.app
   ```
2. Redeploy the Render service (Manual Deploy → Deploy latest)

---

## Step 4 — Firebase authorized domains

Firebase Console → **Authentication** → **Settings** → **Authorized domains**

Add:

- `muyai.vercel.app`
- Your custom domain (if any)

---

## Step 5 — Smoke test

1. Open Vercel URL → register / login
2. Dashboard loads
3. Upload resume (needs AI key on Render)
4. Job Match returns listings (Remotive works without extra keys)

---

## CLI deploy (optional)

### Vercel (from `client/`)

```bash
cd client
npx vercel
npx vercel --prod
```

### Render

Use the dashboard or connect `render.yaml` via **New Blueprint**.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| **Failed to fetch** on login | Fix `VITE_API_URL` on Vercel (must end with `/api`); confirm Render `/api/health` returns 200; set `FRONTEND_URL` on Render; add `muyai.vercel.app` to Firebase authorized domains |
| **Root Directory "client " does not exist** | Remove trailing space in Vercel → Settings → General → Root Directory; must be exactly `client` |
| **ENOENT client/package.json** on Vercel | Root Directory is `client` but install used `--prefix client` — use default `npm install` |
| **NOT_FOUND** on Vercel URL | Confirm Root Directory = `client` and redeploy after a successful build |
| CORS error | Set `FRONTEND_URL` on Render to exact Vercel URL |
| 401 on API | Check Firebase Admin env vars on Render |
| Login fails on live site | Add Vercel domain to Firebase authorized domains |
| Slow first request | Render free tier cold start (~30s) |
| API URL wrong | Rebuild Vercel after changing `VITE_API_URL` |

---

## Custom domain (optional)

- Vercel: `app.yourdomain.com`
- Render: `api.yourdomain.com`
- Update `VITE_API_URL`, `FRONTEND_URL`, and Firebase authorized domains
