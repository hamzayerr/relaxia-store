# Deployment Guide — EasyPanel + Docker

## Infrastructure Overview

```
Internet
    ↓
relaxia.store (Domain via Cloudflare or DNS provider)
    ↓
EasyPanel (VPS with Nginx reverse proxy)
    ├── frontend container → port 3000 → relaxia.store
    ├── backend container  → port 8000 → api.relaxia.store
    └── postgres container → port 5432 (internal only)
```

---

## Domain Setup

```
relaxia.store         → frontend (Next.js) — port 3000
api.relaxia.store     → backend (FastAPI) — port 8000
www.relaxia.store     → redirect to relaxia.store
```

DNS records (in your domain registrar):
```
A    @       → EasyPanel server IP
A    api     → EasyPanel server IP
A    www     → EasyPanel server IP
CNAME www    → relaxia.store (alternative)
```

SSL: EasyPanel handles Let's Encrypt SSL automatically.

---

## Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**next.config.ts** — enable standalone output:
```typescript
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
}
export default nextConfig
```

---

## Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

---

## .dockerignore Files

**frontend/.dockerignore:**
```
node_modules
.next
.env
.env.local
.env*.local
*.md
.git
.gitignore
```

**backend/.dockerignore:**
```
__pycache__
*.pyc
*.pyo
.env
.venv
venv
*.md
.git
.gitignore
```

---

## docker-compose.yml (Local Development)

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: relaxia_store
      POSTGRES_USER: relaxia
      POSTGRES_PASSWORD: localdevpassword123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U relaxia"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app    # Hot reload in development

  frontend:
    build: ./frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Environment Variables

### frontend/.env.example

```env
# API
NEXT_PUBLIC_API_URL=https://api.relaxia.store

# Site
NEXT_PUBLIC_SITE_URL=https://relaxia.store

# Tracking Pixels (public — safe to expose)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=

# Analytics (optional)
NEXT_PUBLIC_GTM_ID=
```

### backend/.env.example

```env
# Database
DATABASE_URL=postgresql://relaxia:password@postgres:5432/relaxia_store

# Security
SECRET_KEY=generate-64-char-random-string-here
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24

# Admin Credentials
ADMIN_USERNAME=relaxia_admin
ADMIN_PASSWORD_HASH=$2b$12$...

# Google Sheets
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec

# Facebook CAPI
FACEBOOK_ACCESS_TOKEN=
FACEBOOK_PIXEL_ID=
FACEBOOK_TEST_EVENT_CODE=

# TikTok CAPI
TIKTOK_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=

# Snapchat CAPI
SNAPCHAT_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=

# CORS
CORS_ORIGINS=https://relaxia.store,https://www.relaxia.store

# App
ENVIRONMENT=production
```

---

## EasyPanel Deployment

### Step 1: Create EasyPanel Apps

In EasyPanel, create 3 apps:

**App 1: relaxia-frontend**
- Type: Docker
- Port: 3000
- Domain: relaxia.store
- SSL: enabled (Let's Encrypt)
- Health check: GET /api/health → but Next.js doesn't have this, use / instead

**App 2: relaxia-backend**
- Type: Docker
- Port: 8000
- Domain: api.relaxia.store
- SSL: enabled
- Health check: GET /api/health

**App 3: relaxia-postgres**
- Type: PostgreSQL (use EasyPanel's built-in)
- Database: relaxia_store
- User: relaxia
- Auto-generate password
- **Internal only** — no public port

### Step 2: Set Environment Variables

In EasyPanel for each app, add the env variables from the .env.example files.

**Critical backend vars:**
- `DATABASE_URL`: Use EasyPanel's internal PostgreSQL URL (not localhost)
  - Format: `postgresql://relaxia:{password}@relaxia-postgres:5432/relaxia_store`
- `SECRET_KEY`: Generate with `openssl rand -hex 32`
- `ADMIN_PASSWORD_HASH`: Generate as shown in admin docs

### Step 3: Connect to GitHub

```
1. Push code to GitHub (frontend/ and backend/ as separate repos or monorepo)
2. In EasyPanel: Connect GitHub repository
3. Set branch: main
4. Enable auto-deploy on push
```

### Step 4: Deploy

```
1. Click Deploy in EasyPanel for backend first (runs migrations)
2. Wait for backend health check to pass
3. Deploy frontend
4. Test: curl https://api.relaxia.store/api/health
5. Test: curl https://relaxia.store
```

### Step 5: Verify Migrations

```bash
# SSH into EasyPanel or use EasyPanel console
# Check migrations ran:
docker exec relaxia-backend alembic current
# Should show: INFO  [alembic.runtime.migration] Running upgrade  -> 0001, Initial migration
```

---

## GitHub Repository Structure

```
relaxia-store/           ← GitHub repo root
├── frontend/            ← Next.js app
├── backend/             ← FastAPI app  
├── sheets/              ← Google Apps Script + CSV template
├── docker-compose.yml   ← Local dev
└── README.md
```

### .gitignore (root)
```
# Env files
.env
.env.local
**/.env
**/.env.local

# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/

# Build outputs
.next/
dist/
build/

# OS
.DS_Store
Thumbs.db
```

---

## Production Checklist

### Before Going Live
- [ ] Domain DNS pointing to EasyPanel server
- [ ] SSL certificates active for relaxia.store and api.relaxia.store
- [ ] Backend health check returns 200
- [ ] Database migrations ran successfully
- [ ] Admin login working
- [ ] Test order: create from frontend → appears in Google Sheets
- [ ] Facebook Pixel firing (use Meta Pixel Helper)
- [ ] TikTok Pixel firing (use TikTok Pixel Helper)
- [ ] Snapchat Pixel firing
- [ ] Cart → checkout → upsell → thank-you flow complete
- [ ] Mobile responsive (test on real phone)
- [ ] RTL layout correct on Arabic text
- [ ] Images loading (WebP format)
- [ ] Page speed: Lighthouse mobile > 80

### Performance Monitoring
- EasyPanel has basic container metrics (CPU, RAM)
- Consider adding Sentry for error tracking:
  ```
  npm install @sentry/nextjs
  pip install sentry-sdk[fastapi]
  ```

---

## Backup Strategy

### Database Backup
EasyPanel managed PostgreSQL includes daily backups.  
Additionally, export orders manually from Google Sheets as needed.

### Manual Backup
```bash
# SSH into server
docker exec relaxia-postgres pg_dump -U relaxia relaxia_store > backup_$(date +%Y%m%d).sql
```

---

## Scaling Notes

For MVP/launch:
- 1 backend worker is fine (2 workers in Dockerfile)
- 1 frontend instance
- PostgreSQL on same server

When orders scale (100+/day):
- Increase backend workers: `--workers 4`
- Consider separate DB server
- Add Redis for caching (product data)
- Add CDN (Cloudflare) for static assets — already handled if using Cloudflare DNS
