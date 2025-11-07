# Backend Setup Guide

## Prerequisites

- Node.js v14 or higher
- MongoDB 4.4 or higher
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

Required packages:
- express: Web framework
- mongoose: MongoDB ODM
- socket.io: Real-time communication
- jsonwebtoken: JWT authentication
- bcrypt: Password hashing
- cors: Cross-origin resource sharing
- dotenv: Environment variables

### 2. Configure Environment Variables

Create `.env` file in backend directory:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/ctms
MONGODB_USER=admin
MONGODB_PASSWORD=password

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Storage
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=ctms-bucket
\`\`\`

### 3. MongoDB Setup

#### Local MongoDB
\`\`\`bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
\`\`\`

#### MongoDB Atlas (Cloud)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Add user credentials
4. Get connection string
5. Use connection string in MONGODB_URI

### 4. Start Server

Development mode:
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

Server runs on `http://localhost:5000`

## Verification

Check if server is running:
\`\`\`bash
curl http://localhost:5000/health
\`\`\`

Expected response:
\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00Z",
  "mongodb": "connected"
}
\`\`\`

## Database Initialization

### Seed Initial Data

\`\`\`bash
node scripts/seed-database.js
\`\`\`

### Create Indexes

\`\`\`javascript
// Recommended MongoDB indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.vehicles.createIndex({ registrationNumber: 1 }, { unique: true })
db.routes.createIndex({ name: 1 }, { unique: true })
db.payments.createIndex({ student: 1, createdAt: -1 })
db.trips.createIndex({ driver: 1, createdAt: -1 })
\`\`\`

## API Testing

### Using Postman

1. Import collection from `postman-collection.json`
2. Set environment variables
3. Test endpoints

### Using cURL

\`\`\`bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "role": "student"
  }'
\`\`\`

## Troubleshooting

### MongoDB Connection Error
\`\`\`bash
# Check if MongoDB is running
mongosh

# If error, start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
net start MongoDB  # Windows
\`\`\`

### Port Already in Use
\`\`\`bash
# Change PORT in .env or kill process using port
lsof -i :5000
kill -9 <PID>
\`\`\`

### CORS Errors
- Ensure FRONTEND_URL in .env matches your frontend URL
- Check CORS middleware configuration in server.js

### JWT Errors
- Verify JWT_SECRET is set in .env
- Check token format in Authorization header: `Bearer <token>`

## Performance Tuning

### Database Optimization
\`\`\`javascript
// Enable indexes for faster queries
db.createCollection("users", { collation: { locale: "en" } })

// Connection pooling
maxPoolSize: 10
\`\`\`

### Caching Strategy
- Implement Redis for session storage
- Cache frequently accessed routes
- Use ETags for responses

## Monitoring

### Logging
- Configure winston or pino for logging
- Monitor error logs in production

### Health Checks
\`\`\`bash
# Automated health checks
curl http://localhost:5000/health -w "\n%{http_code}\n"
\`\`\`

## Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB credentials are secure
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is active
- [ ] HTTPS is enabled (production)
- [ ] Environment variables are not committed
- [ ] Dependencies are up-to-date

## Deployment

### Heroku
\`\`\`bash
heroku create ctms-api
git push heroku main
heroku config:set MONGODB_URI=<mongodb_connection>
\`\`\`

### AWS EC2
\`\`\`bash
# Connect via SSH
ssh -i key.pem ubuntu@instance-ip

# Install Node.js and MongoDB
sudo apt update
sudo apt install nodejs mongodb

# Deploy application
git clone <repository>
npm install
npm start
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
\`\`\`

## Next Steps

1. Configure payment gateway (Razorpay/Stripe)
2. Set up email service for notifications
3. Implement advanced caching
4. Configure CI/CD pipeline
5. Set up monitoring and alerting
