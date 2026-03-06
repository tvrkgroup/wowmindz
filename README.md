# silver-brook-school

## Run

```bash
npm install
npm run dev
```

## Admin dashboard

1. Copy `.env.example` to `.env.local` and set secure values.
2. Start the app and open `http://localhost:3000/admin`.
3. Sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
4. Manage:
   - School name, tagline, phone, email, address
   - Logo path (example: `/logo.png`)
   - Theme colors (`paper`, `brand400`, `brand600`, `brand700`)
   - Page visibility (hidden pages return 404)
   - News/events entries

Saved settings are stored in `data/site-config.json`.

## Vercel production setup

Set these environment variables in Vercel Project Settings:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

For logo upload from admin directly to GitHub:

- `GITHUB_REPO` (format: `owner/repo`)
- `GITHUB_BRANCH` (usually `main`)
- `GITHUB_TOKEN` (repo write permission)

Notes:
- If KV vars are present, admin config is persisted in KV (works on Vercel).
- If KV vars are not present, local file storage (`data/site-config.json`) is used.
- "Rollback to Baseline" in dashboard resets config to built-in default settings.
