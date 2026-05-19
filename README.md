# RELAXIA Store

DTC branded e-commerce store for Morocco — Arabic RTL — COD only.

## Quick Start (Local Dev)

```bash
# 1. Copy env files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 2. Start everything
docker compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Admin:    http://localhost:3000/admin
```

Default admin credentials (local only):
- Username: `admin`
- Password: `admin123`

## Project Structure

```
relaxia-store/
├── frontend/     Next.js 15 + React + Tailwind (Arabic RTL)
├── backend/      Python FastAPI + PostgreSQL
├── sheets/       Google Apps Script webhook + CSV template
├── docker-compose.yml
└── README.md
```

## Deploy to EasyPanel

1. Push to GitHub
2. Create 3 apps in EasyPanel: `relaxia-frontend`, `relaxia-backend`, `relaxia-postgres`
3. Set env variables from `.env.example` files
4. Backend `DATABASE_URL`: use internal EasyPanel PostgreSQL URL
5. Generate `SECRET_KEY`: `openssl rand -hex 32`
6. Generate `ADMIN_PASSWORD_HASH`:
   ```bash
   python3 -c "from passlib.context import CryptContext; ctx = CryptContext(schemes=['bcrypt']); print(ctx.hash('your_password'))"
   ```
7. Deploy backend first (runs migrations), then frontend

## Google Sheets Setup

1. Create a Google Sheet
2. Open: Extensions → Apps Script
3. Paste content of `sheets/google-apps-script-webhook.js`
4. Deploy as Web App (Anyone can access)
5. Copy URL → add to backend `.env` as `GOOGLE_SHEETS_WEBHOOK_URL`

## Domains

- `relaxia.store` → frontend (port 3000)
- `api.relaxia.store` → backend (port 8000)

## Products

| Product | SKU | Price |
|---------|-----|-------|
| كولوفلورا (COLOFLORA) | RLX-COL-30 | 229 / 345 / 430 MAD |
| بيلوريكس (PYLOREX) | RLX-PYL-30 | 229 / 345 / 430 MAD |
| فليكسيما (FLEXIMA) | RLX-FLX-100 | 229 / 345 / 430 MAD |
