# 🚀 Render.com Deployment - Quick Setup Guide

## Backend Environment Variables for Production

### Copy-Paste to Render Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ RENDER ENVIRONMENT VARIABLES                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ MONGODB_URI                                                │
│ mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj... │
│                                                             │
│ JWT_SECRET                                                 │
│ [Generate using: node -e "console.log(require('crypto')    │
│  .randomBytes(32).toString('hex'))"]                       │
│                                                             │
│ NODE_ENV                                                   │
│ production                                                 │
│                                                             │
│ FRONTEND_URL                                               │
│ https://your-frontend-domain.com                          │
│                                                             │
│ DB_MAX_POOL_SIZE                                           │
│ 20                                                         │
│                                                             │
│ DB_SERVER_SELECTION_TIMEOUT                                │
│ 5000                                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Setup

### 1️⃣ Generate JWT Secret

Open terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the output** (looks like): 
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

### 2️⃣ Get Your Frontend Domain

- If deployed on **Vercel**: `https://your-app.vercel.app`
- If deployed on **Render**: `https://your-app.onrender.com`
- If custom domain: `https://yourdomain.com`

---

### 3️⃣ Go to Render Dashboard

1. Login to https://render.com
2. Select your backend service
3. Click **Environment** tab
4. Click **Add Environment Variable**

---

### 4️⃣ Add Variables One by One

#### Variable 1: MONGODB_URI
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0`

#### Variable 2: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: [Paste the generated string from Step 1]

#### Variable 3: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

#### Variable 4: FRONTEND_URL
- **Key**: `FRONTEND_URL`
- **Value**: [Paste your frontend domain from Step 2]

#### Variable 5: DB_MAX_POOL_SIZE
- **Key**: `DB_MAX_POOL_SIZE`
- **Value**: `20`

#### Variable 6: DB_SERVER_SELECTION_TIMEOUT
- **Key**: `DB_SERVER_SELECTION_TIMEOUT`
- **Value**: `5000`

---

### 5️⃣ Deploy

Click **Save** and redeploy. That's it! 🎉

---

## ✅ Verification

Test your API:
```bash
curl https://your-backend-render-url.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-07T18:00:00.000Z",
  "mongodb": "connected"
}
```

---

## 📁 Files Reference

| File | Purpose |
|------|---------|
| `RENDER_DEPLOYMENT_GUIDE.md` | 📖 Full detailed guide |
| `BACKEND_ENV_VARS_SUMMARY.md` | 📋 Quick reference table |
| `backend/.env.production` | ⚙️ Environment template |
| `backend/.env` | 💾 Current development config |

---

## 🔐 Security Notes

⚠️ **Never commit `.env` files to GitHub!**

✅ **Do:**
- Store secrets in Render Environment dashboard
- Use strong random JWT_SECRET
- Keep special characters URL-encoded in MongoDB URI
- Use HTTPS for FRONTEND_URL in production

❌ **Don't:**
- Share JWT_SECRET publicly
- Hardcode secrets in code
- Use localhost URLs in production

---

## Common Issues

### ❌ "CORS Error"
**Fix**: Update FRONTEND_URL to match your actual frontend domain

### ❌ "MongoDB connection failed"
**Fix**: 
- Copy-paste URI exactly as provided
- Ensure @ symbols are %40 encoded
- Whitelist Render IPs in MongoDB Atlas (or use 0.0.0.0/0)

### ❌ "JWT token invalid"
**Fix**: Don't change JWT_SECRET after users have tokens

---

## Need Help?

- 📚 Full Guide: `RENDER_DEPLOYMENT_GUIDE.md`
- 🔗 Render Docs: https://render.com/docs
- 🌍 MongoDB Atlas: https://www.mongodb.com/cloud/atlas

