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
FRONTEND_URL=           # set after Vercel deploy, e.g. https://muyai.vercel.app
```

4. Deploy and note your API URL, e.g. `https://muyai-api.onrender.com`
5. Test: `https://muyai-api.onrender.com/api/health`

---

## Step 2 — Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import **AwakendJJ/Muyai**
2. Settings:

| Setting | Value |
|---------|--------|
| Root Directory | `client` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

3. **Environment variables** (Production):

```
VITE_API_URL=https://muyai-api.onrender.com/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_PLAN_GATING_ENABLED=false
```

4. Deploy → note URL, e.g. `https://muyai.vercel.app`

`client/vercel.json` handles React Router SPA rewrites.

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
