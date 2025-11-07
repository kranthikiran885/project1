# 🚀 Complete Deployment Guide

This guide provides step-by-step instructions for deploying CTMS 2.0 to production.

## 📋 Pre-Deployment Checklist

- [ ] Code is tested and working locally
- [ ] Environment variables are configured
- [ ] Database is set up (MongoDB Atlas)
- [ ] Payment gateways are configured
- [ ] Domain names are ready (optional)
- [ ] SSL certificates are prepared (handled by platforms)

## 🌐 Frontend Deployment (Vercel)

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Root Directory**
   ```bash
   vercel
   ```

4. **Configure Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://your-backend.onrender.com
   
   vercel env add NEXT_PUBLIC_SOCKET_URL
   # Enter: https://your-backend.onrender.com
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select root directory

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
   NEXT_PUBLIC_SOCKET_URL = https://your-backend.onrender.com
   NEXT_PUBLIC_RAZORPAY_KEY = rzp_live_xxxxx
   NEXT_PUBLIC_STRIPE_KEY = pk_live_xxxxx
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at `https://your-app.vercel.app`

## 🖥️ Backend Deployment (Render)

### Method 1: GitHub Integration (Recommended)

1. **Prepare Backend Code**
   ```bash
   cd backend
   # Ensure package.json has correct scripts
   ```

2. **Create Render Account**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure Service**
   ```
   Name: ctms-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

5. **Add Environment Variables**
   ```
   NODE_ENV = production
   PORT = 10000
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/ctms
   JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters
   FRONTEND_URL = https://your-frontend.vercel.app
   RAZORPAY_KEY_ID = rzp_live_xxxxx
   RAZORPAY_KEY_SECRET = xxxxx
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be available at `https://your-backend.onrender.com`

### Method 2: Manual Deployment

1. **Build Locally**
   ```bash
   cd backend
   npm install --production
   ```

2. **Deploy via Git**
   ```bash
   git remote add render https://git.render.com/srv-xxxxx.git
   git push render main
   ```

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
- Visit [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Sign up for free account

### 2. Create Cluster
- Click "Build a Database"
- Choose "Shared" (Free tier)
- Select cloud provider and region
- Choose cluster tier (M0 Sandbox - Free)
- Name your cluster: `ctms-cluster`

### 3. Create Database User
- Go to "Database Access"
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `ctms_user`
- Password: Generate secure password
- Database User Privileges: "Read and write to any database"

### 4. Configure Network Access
- Go to "Network Access"
- Click "Add IP Address"
- Choose "Allow Access from Anywhere" (0.0.0.0/0)
- Or add specific IPs for better security

### 5. Get Connection String
- Go to "Database" → "Connect"
- Choose "Connect your application"
- Copy connection string:
  ```
  mongodb+srv://ctms_user:<password>@ctms-cluster.xxxxx.mongodb.net/ctms?retryWrites=true&w=majority
  ```

### 6. Test Connection
```bash
# Test with MongoDB Compass or CLI
mongosh "mongodb+srv://ctms_user:password@ctms-cluster.xxxxx.mongodb.net/ctms"
```

## 💳 Payment Gateway Configuration

### Razorpay Setup

1. **Create Account**
   - Visit [razorpay.com](https://razorpay.com)
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings → API Keys
   - Generate new key pair
   - Copy Key ID and Key Secret

3. **Configure Webhooks**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-backend.onrender.com/api/payments/webhook`
   - Select events: payment.captured, payment.failed

### Stripe Setup

1. **Create Account**
   - Visit [stripe.com](https://stripe.com)
   - Complete account setup

2. **Get API Keys**
   - Go to Developers → API Keys
   - Copy Publishable and Secret keys

3. **Configure Webhooks**
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-backend.onrender.com/api/payments/stripe-webhook`
   - Select events: payment_intent.succeeded, payment_intent.payment_failed

## 🔧 Post-Deployment Configuration

### 1. Update Frontend API URL
```bash
# Update environment variable in Vercel
vercel env add NEXT_PUBLIC_API_URL
# Enter your Render backend URL
```

### 2. Update Backend CORS
```javascript
// In backend/server.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000' // Keep for development
  ],
  credentials: true
}))
```

### 3. Test All Endpoints
```bash
# Test health endpoint
curl https://your-backend.onrender.com/health

# Test authentication
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ctms.com","password":"admin123","role":"admin"}'
```

### 4. Seed Production Database
```bash
# Run seeding script
curl -X POST https://your-backend.onrender.com/api/admin/seed
```

## 🔍 Monitoring & Maintenance

### Health Checks
```bash
# Set up monitoring
curl https://your-backend.onrender.com/health
curl https://your-frontend.vercel.app/api/health
```

### Log Monitoring
- **Vercel**: Check function logs in Vercel dashboard
- **Render**: Check service logs in Render dashboard
- **MongoDB**: Monitor in Atlas dashboard

### Performance Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor response times
- Track error rates

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### API Connection Issues
- Verify CORS configuration
- Check environment variables
- Ensure backend is running

#### Database Connection Issues
- Verify MongoDB URI format
- Check network access settings
- Confirm user permissions

#### Payment Issues
- Verify API keys are correct
- Check webhook configurations
- Test in sandbox mode first

### Debug Commands
```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test API endpoints
curl -v https://your-backend.onrender.com/api/health
```

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] JWT secret is strong (32+ characters)
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] CORS is properly configured
- [ ] Database access is restricted
- [ ] API keys are not exposed in frontend
- [ ] Rate limiting is implemented
- [ ] Input validation is active

## 📈 Performance Optimization

### Frontend Optimizations
- Enable Vercel Analytics
- Optimize images with Next.js Image component
- Implement proper caching headers
- Use CDN for static assets

### Backend Optimizations
- Implement Redis caching
- Optimize database queries
- Use connection pooling
- Enable compression

## 🎯 Go Live Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and responding
- [ ] Database connected and seeded
- [ ] Payment gateways configured
- [ ] SSL certificates active
- [ ] Domain names configured (if custom)
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Team access configured
- [ ] Documentation updated

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Create an issue on GitHub with deployment logs
4. Contact support: deployment@ctms.com

---

**🎉 Congratulations! Your CTMS 2.0 application is now live in production!**