# Render Environment Variables Setup

## Backend Service (projectbackend-i9rc)

Set these environment variables in Render Dashboard:

```
FRONTEND_URL=https://projectfrontend-xfoj.onrender.com
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=10000
```

## Frontend Service (projectfrontend-xfoj)

Set these environment variables in Render Dashboard:

```
NEXT_PUBLIC_API_URL=https://projectbackend-i9rc.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://projectbackend-i9rc.onrender.com
NEXT_PUBLIC_APP_NAME=College Cosmos Home
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEBUG=false
NODE_ENV=production
```

## How to Set Environment Variables on Render

1. Go to https://dashboard.render.com
2. Click on the service (backend or frontend)
3. Go to **Environment** tab → **Environment Variables**
4. Click **Add Environment Variable**
5. Paste each variable name and value
6. **Save** (this will trigger a redeploy)

## Important Notes

- **FRONTEND_URL** on backend should match your frontend domain exactly (without trailing slash)
- **NEXT_PUBLIC_API_URL** on frontend should match your backend domain exactly
- Make sure MongoDB URI is correct and accessible
- JWT_SECRET should be a long, random string for production
