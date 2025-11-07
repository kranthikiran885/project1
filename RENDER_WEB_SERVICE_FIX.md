# Render Web Service Deployment Guide - Fix 503 Error

## Problem: HTTP 503 Error
The Render Web Service is unable to handle requests. This happens when:
- Start command is incorrect
- App crashes on startup
- Port not listening correctly

## Solution: Proper Configuration

### Step 1: Update next.config.js
Make sure Next.js is configured to run as a server (not static export):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js will run as server, not static export
  // Remove any 'output: "export"' config
}

module.exports = nextConfig
```

### Step 2: Render Web Service Settings
Go to Render Dashboard → Your Service → Settings

**Build Configuration:**
- **Build Command:** `pnpm install --frozen-lockfile && pnpm run build`
- **Start Command:** `pnpm start`
- **Node Version:** 22 (default is fine)

**Environment Variables:**
Set all these in Render Dashboard:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_NAME=College Cosmos Home
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG=false
```

**Port Configuration:**
- Render automatically sets PORT=10000
- Next.js listens on this port by default ✓

### Step 3: Check Build Logs
1. Go to Render Dashboard
2. Click your service "frontend-s2gd"
3. Click "Logs" tab
4. Look for error messages during build or startup

### Step 4: Manual Deploy/Restart
1. Go to "Deploys" tab
2. Click the latest deploy
3. Click "Redeploy" or "Trigger Deploy" if available
4. Wait 2-3 minutes
5. Refresh the URL

### Common Issues & Fixes

**Issue: "Cannot find module 'X'"**
- Solution: Delete node_modules in repo locally, commit clean state, redeploy

**Issue: "Port is already in use"**
- Solution: Make sure start command is just `pnpm start` (not `node server.js`)

**Issue: "Build failed"**
- Solution: Check build logs, fix any build errors in components

### Debug: Local Testing
Test locally before deploying:
```bash
cd college-cosmos-home
pnpm install
pnpm build
pnpm start
```
Should start on http://localhost:3000 (or PORT=3000 pnpm start)

### Alternative: Use render.yaml
Create a `render.yaml` in repo root:

```yaml
services:
  - type: web
    name: college-cosmos-frontend
    env: node
    rootDir: college-cosmos-home
    buildCommand: pnpm install --frozen-lockfile && pnpm run build
    startCommand: pnpm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: NEXT_PUBLIC_API_URL
        value: https://your-backend-url.onrender.com
```

Then in Render: Import this file during setup

---

## Next Steps

1. **Check build logs** for specific error messages
2. **Verify start command** is exactly: `pnpm start`
3. **Redeploy** with correct settings
4. **Wait 2-3 minutes** for startup
5. **Refresh** your URL

If you share the build/startup logs, I can help debug the exact issue! 📋
