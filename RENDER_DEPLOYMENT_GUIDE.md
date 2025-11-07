# Render.com Deployment Guide - Backend Environment Variables

## Overview
This guide explains all the environment variables needed to deploy the CTMS Backend to Render.com

---

## Backend Environment Variables for Production

### 1. **MONGODB_URI** ✅ (Database Connection)
```
mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0
```
- **Description**: MongoDB Atlas connection string
- **Type**: String (URL)
- **Required**: Yes
- **Example**: `mongodb+srv://username:password@cluster.mongodb.net/?appName=ProjectName`
- **Notes**: 
  - Keep special characters URL-encoded (e.g., `@` → `%40`)
  - Use MongoDB Atlas for cloud database
  - Free tier available at mongodb.com/cloud/atlas

---

### 2. **PORT** (Server Port)
```
5000
```
- **Description**: Port where backend server runs
- **Type**: Number
- **Required**: No (defaults to 5000)
- **Default**: `5000`
- **Notes**: Render automatically assigns a port; this should be ignored for Render

---

### 3. **JWT_SECRET** 🔐 (Authentication Secret)
```
ctms_super_secret_jwt_key_for_development_only_change_in_production
```
- **Description**: Secret key for JWT token signing
- **Type**: String (Random/Strong)
- **Required**: Yes
- **Min Length**: 32 characters recommended
- **Current**: ⚠️ **INSECURE - CHANGE THIS!**

#### Recommended Production Value:
Generate a strong random string:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

### 4. **FRONTEND_URL** (CORS Configuration)
```
http://localhost:3000
```
- **Description**: Frontend URL for CORS (Cross-Origin Resource Sharing)
- **Type**: String (URL)
- **Required**: Yes
- **Current (Dev)**: `http://localhost:3000`

#### Recommended Production Value:
```
https://your-frontend-domain.com
```

**Examples:**
- `https://ctms-frontend.vercel.app` (Vercel deployed frontend)
- `https://ctms.yourcompany.com` (Custom domain)
- `https://frontend.render.com` (Render deployed frontend)

---

### 5. **NODE_ENV** (Environment Type)
```
production
```
- **Description**: Sets Node.js environment mode
- **Type**: String
- **Required**: Yes for production
- **Options**: `development`, `production`, `staging`
- **Default**: `development`
- **Impact**: 
  - Disables debug logs
  - Enables optimizations
  - Strict error handling

---

### 6. **DB_MAX_POOL_SIZE** (Database Connection Pool)
```
10
```
- **Description**: Maximum database connections to pool
- **Type**: Number
- **Required**: No
- **Default**: `10`
- **Recommended**: 10-20 for small apps, 50+ for high traffic

---

### 7. **DB_SERVER_SELECTION_TIMEOUT** (Database Timeout)
```
5000
```
- **Description**: Timeout (ms) for database server selection
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `5000` (5 seconds)

---

## Production Environment File (.env.production)

Create `.env.production` file with these values:

```env
# Production Environment Variables for Backend

# Database
MONGODB_URI=mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0

# Authentication
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Database Options
DB_MAX_POOL_SIZE=20
DB_SERVER_SELECTION_TIMEOUT=5000
```

---

## Render.com Deployment Steps

### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub/GitLab

### Step 2: Add Environment Variables in Render Dashboard
1. Go to your service dashboard
2. Click "Environment"
3. Add each variable:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://kranthi:kranthi%401234@cluster0.ycbgnbj.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `[Your strong random key]` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend-domain.com` |
| `DB_MAX_POOL_SIZE` | `20` |
| `PORT` | `5000` |

### Step 3: Deploy
- Push code to GitHub
- Render auto-deploys on push
- Check deployment logs

---

## ⚠️ Security Checklist

- [ ] Changed `JWT_SECRET` to a strong random value
- [ ] Updated `FRONTEND_URL` to production domain
- [ ] Set `NODE_ENV=production`
- [ ] All secrets stored in Render environment (NOT in code)
- [ ] MongoDB URI uses URL-encoded special characters
- [ ] CORS configured for only your frontend domain
- [ ] SSL/HTTPS enabled (automatic on Render)

---

## Common Issues & Solutions

### Issue 1: "MongoDB connection failed"
**Solution**: 
- Verify MongoDB URI is correct
- Check special characters are URL-encoded
- Ensure IP whitelist includes Render IPs (or use 0.0.0.0/0)

### Issue 2: "CORS Error: Origin not allowed"
**Solution**:
- Update `FRONTEND_URL` to match your frontend's actual domain
- Remove `http://localhost:3000` from production

### Issue 3: "JWT token invalid"
**Solution**:
- Ensure `JWT_SECRET` is the same across all server restarts
- Don't change JWT_SECRET after users have tokens

### Issue 4: "401 Unauthorized"
**Solution**:
- Check JWT token expiration (default: 7 days)
- Verify `JWT_SECRET` on both frontend and backend

---

## Testing Production Environment Variables

Use this curl command to test:

```bash
# Test Health Endpoint
curl -X GET https://your-backend-render-url.onrender.com/health

# Expected Response:
{
  "status": "OK",
  "timestamp": "2025-11-07T18:00:00.000Z",
  "mongodb": "connected"
}

# Test Registration
curl -X POST https://your-backend-render-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "SecurePass123!",
    "role": "student"
  }'
```

---

## Environment Variable Reference Table

| Variable | Dev Value | Production Value | Required |
|----------|-----------|------------------|----------|
| `MONGODB_URI` | `mongodb://localhost:27017/ctms` | `mongodb+srv://...` | ✅ Yes |
| `JWT_SECRET` | `development_key` | `[Random 32+ chars]` | ✅ Yes |
| `PORT` | `5000` | `5000` | ❌ No |
| `NODE_ENV` | `development` | `production` | ✅ Yes |
| `FRONTEND_URL` | `http://localhost:3000` | `https://domain.com` | ✅ Yes |
| `DB_MAX_POOL_SIZE` | `10` | `20` | ❌ No |
| `DB_SERVER_SELECTION_TIMEOUT` | `5000` | `5000` | ❌ No |

---

## Generate Strong JWT_SECRET

**Option 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
- https://www.random.org/bytes/ (copy & paste)

---

## File Structure After Deployment

```
Backend (Render)
├── .env (Render Environment Variables)
├── server.js
├── controllers/
├── models/
├── routes/
└── middleware/
```

---

## Verification Checklist

Before deploying to Render:

- [x] MongoDB Atlas connection string ready
- [x] JWT_SECRET generated and stored securely
- [x] Frontend domain known for CORS
- [x] NODE_ENV set to "production"
- [x] All environment variables added to Render dashboard
- [x] Code pushed to GitHub
- [x] Render service connected to GitHub repo
- [x] Build command: `npm install`
- [x] Start command: `npm start` or `node server.js`

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **JWT Guide**: https://jwt.io
- **CORS Reference**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

