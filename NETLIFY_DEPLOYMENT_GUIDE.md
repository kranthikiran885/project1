# Netlify Deployment Guide - Frontend (Next.js)

## Overview
This guide explains how to deploy the College Cosmos Home frontend to Netlify.

---

## Prerequisites

✅ Frontend code pushed to GitHub (main branch)
✅ Backend deployed on Render (or your chosen platform)
✅ Netlify account created (https://netlify.com)

---

## Step 1: Connect GitHub Repository

1. Go to **https://netlify.com** and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** as your git provider
4. Authorize Netlify to access your GitHub account
5. Select repository: **kranthikiran885/ctm**
6. Click **"Deploy site"**

---

## Step 2: Configure Build Settings

### Basic Configuration

| Setting | Value |
|---------|-------|
| **Branch to deploy** | `main` |
| **Base directory** | `college-cosmos-home` |
| **Build command** | `pnpm install && pnpm build` |
| **Publish directory** | `.next` |

### Netlify UI Path
```
Site settings → Build & deploy → Build settings
```

---

## Step 3: Set Environment Variables

### In Netlify Dashboard

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Click **"Add environment variables"**
3. Add each variable:

#### Frontend Environment Variables

| Key | Value | Type |
|-----|-------|------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.onrender.com` | Public |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-backend-url.onrender.com` | Public |
| `NEXT_PUBLIC_APP_NAME` | `College Cosmos Home` | Public |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Public |
| `NEXT_PUBLIC_DEBUG` | `false` | Public |
| `NODE_ENV` | `production` | Public |

#### Optional Variables (if using Google Maps/Analytics)

| Key | Value | Type |
|-----|-------|------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `your-api-key` | Public |
| `NEXT_PUBLIC_GA_TRACKING_ID` | `your-tracking-id` | Public |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `your-vapid-key` | Public |

---

## Step 4: Update Frontend API Configuration

Update your frontend environment variables file:

**File: `.env.production` (in root)**

```bash
# Production Environment Variables for Frontend

# API Configuration - IMPORTANT: Update this to your backend URL
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_APP_NAME="College Cosmos Home"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-production-google-maps-key

# Push Notifications (optional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-production-vapid-public-key

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=your-google-analytics-id

# Debug Mode
NEXT_PUBLIC_DEBUG=false

# Environment
NODE_ENV=production
```

---

## Step 5: Update authService Backend URL

**File: `lib/auth-service.js`**

Verify the API_BASE_URL uses the environment variable:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
```

This is already correct in your code. ✅

---

## Step 6: Deploy

### Option A: Automatic Deployment
- Push code to GitHub `main` branch
- Netlify automatically builds and deploys
- Watch deployment progress in **Deployments** tab

### Option B: Manual Trigger
1. Go to **Netlify Dashboard**
2. Select your site
3. Click **"Trigger deploy"** → **"Deploy site"**

---

## Step 7: Verify Deployment

1. **Check Build Logs**
   - Go to **Deployments** tab
   - Click latest deployment
   - Check build logs for errors

2. **Test Live Site**
   - Click **"Preview"** or visit the provided URL
   - Example: `https://transportvucse.netlify.app`

3. **Test API Integration**
   - Try signup/login
   - Verify API calls go to your Render backend
   - Check browser DevTools → Network tab

---

## Common Issues & Solutions

### Issue 1: Build fails - "pnpm: command not found"
**Solution**: 
- Go to **Build & deploy** → **Build image selection**
- Select **Ubuntu Focal (default)** or newer
- Ensure Node.js version is 18+

### Issue 2: CORS errors from backend
**Solution**:
- Update backend `FRONTEND_URL` environment variable
- Should be your Netlify domain: `https://transportvucse.netlify.app`
- Restart backend service

### Issue 3: Environment variables not loading
**Solution**:
- Clear Netlify cache: **Deploys** → **Trigger deploy** → **Clear cache and deploy**
- Verify variables in **Site settings** → **Build & deploy** → **Environment**

### Issue 4: "Cannot find module" errors
**Solution**:
- Make sure `pnpm install` is in your build command
- Check `package.json` is in `college-cosmos-home` root

### Issue 5: API calls return 404
**Solution**:
- Verify `NEXT_PUBLIC_API_URL` points to correct backend URL
- Check backend is actually running
- Verify CORS configuration on backend

---

## Netlify Build Command Breakdown

```bash
pnpm install && pnpm build
```

- `pnpm install`: Installs all dependencies
- `pnpm build`: Builds Next.js for production
- Creates optimized `.next` folder for deployment

---

## File Structure for Netlify

```
college-cosmos-home/
├── .next/                    ← Published to Netlify
├── app/
├── components/
├── lib/
├── public/
├── package.json              ← Required
├── pnpm-lock.yaml           ← Required
├── next.config.js           ← Required
├── postcss.config.js
├── tailwind.config.js
└── jsconfig.json
```

---

## Environment Variable Reference

### What Each Variable Does

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://backend.onrender.com` |
| `NEXT_PUBLIC_SOCKET_URL` | Real-time WebSocket | `https://backend.onrender.com` |
| `NEXT_PUBLIC_APP_NAME` | App display name | `College Cosmos Home` |
| `NEXT_PUBLIC_DEBUG` | Enable debug logging | `false` (production) |
| `NODE_ENV` | Build environment | `production` |

---

## Custom Domain Setup (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain: `ctms.yourdomain.com`
4. Follow DNS configuration steps
5. Update backend `FRONTEND_URL` to match

---

## Monitoring & Logs

### Access Logs
- **Deployments**: View build status
- **Functions**: View function logs (if using)
- **Errors**: View error logs
- **Notifications**: Set up Slack/email alerts

### Performance
- Go to **Analytics** tab
- Monitor page load times
- Track error rates

---

## Redeploy Strategies

### Force Rebuild
1. **Clear cache and deploy**
   - Deployments → Trigger deploy → Clear cache and deploy

2. **Rollback to previous version**
   - Deployments → Previous deployment → Publish

3. **Update single environment variable**
   - Site settings → Build & deploy → Environment → Edit → Save
   - Automatically triggers rebuild

---

## Netlify Configuration File (Optional)

Create `netlify.toml` in project root:

```toml
[build]
  base = "college-cosmos-home/"
  command = "pnpm install && pnpm build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://your-backend-url.onrender.com"
  NODE_ENV = "production"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-url.onrender.com/api/:splat"
  status = 200
  force = true
```

---

## Production Checklist

- [x] GitHub repository connected
- [x] Environment variables added
- [x] Backend URL configured
- [x] Build command set correctly
- [x] Publish directory set to `.next`
- [x] CORS configured on backend
- [x] SSL/HTTPS enabled (automatic)
- [x] Custom domain (optional)
- [x] Monitoring enabled
- [x] Error tracking setup

---

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Netlify Support**: https://support.netlify.com
- **Status Page**: https://www.netlifystatus.com

---

## Next Steps

1. ✅ Push `.env.production` to GitHub
2. ✅ Connect repository to Netlify
3. ✅ Add environment variables
4. ✅ Trigger initial deploy
5. ✅ Test signup/login flow
6. ✅ Monitor logs for errors

