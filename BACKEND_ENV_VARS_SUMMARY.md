# Backend Environment Variables Summary

## For Render.com Production Deployment

### 📋 Required Environment Variables

| Variable | Value | Purpose |
|----------|-------|---------|
| **MONGODB_URI** | `mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0` | Database connection (MongoDB Atlas) |
| **JWT_SECRET** | `[Generate strong random key]` | 🔐 JWT token signing secret |
| **FRONTEND_URL** | `https://your-frontend-domain.com` | CORS configuration |
| **NODE_ENV** | `production` | Environment mode |

---

## 🔧 How to Set in Render Dashboard

1. Go to your Render service
2. Click **Environment** tab
3. Add each variable:

### Example:
```
Key: MONGODB_URI
Value: mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0

Key: JWT_SECRET  
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

Key: FRONTEND_URL
Value: https://your-frontend-domain.com

Key: NODE_ENV
Value: production
```

---

## 🔐 Generate Strong JWT_SECRET

Run this in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
f3a9d7e8c2b5a1f9c7e3d6b2f8a4e1c9d5b7f2a8e4c1d6b3f9a5e2c8d1b7f4
```

Use this as your JWT_SECRET ⬆️

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas URI ready
- [ ] JWT_SECRET generated
- [ ] Frontend domain known (for CORS)
- [ ] All variables added to Render Environment
- [ ] Code committed to GitHub
- [ ] Render service connected to GitHub

---

## Files Created

1. **RENDER_DEPLOYMENT_GUIDE.md** - Complete deployment guide
2. **backend/.env.production** - Production environment template
3. **This file** - Quick reference

---

## Current Values (Development)

```env
MONGODB_URI=mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0
JWT_SECRET=ctms_super_secret_jwt_key_for_development_only_change_in_production
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## Next Steps

1. ✅ Read `RENDER_DEPLOYMENT_GUIDE.md`
2. ✅ Generate a strong `JWT_SECRET`
3. ✅ Update `FRONTEND_URL` to your production domain
4. ✅ Add all variables to Render dashboard
5. ✅ Deploy!

