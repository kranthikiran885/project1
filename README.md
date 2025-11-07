# 🚌 College Transport Management System (CTMS) 2.0

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-blue?style=for-the-badge&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-Deployed-purple?style=for-the-badge&logo=render" alt="Render" />
</div>

<div align="center">
  <h3>🎯 A modern, comprehensive transportation management platform for college campuses</h3>
  <p>Real-time GPS tracking • AI-powered analytics • Multi-role management • Safety-first approach</p>
</div>

---

## ✨ Key Features

### 🔄 **Real-Time Operations**
- **Live GPS Tracking**: Real-time bus location with dynamic ETA calculations
- **Socket.IO Integration**: Instant notifications and live data synchronization
- **Real-Time Dashboard**: Live metrics, alerts, and system status updates

### 👥 **Multi-Role Management**
- **Admin Portal**: Complete system oversight with analytics and management tools
- **Driver Dashboard**: Trip management, student manifest, and performance tracking
- **Student App**: Bus booking, live tracking, digital passes, and payment history
- **Parent Portal**: Child tracking, emergency alerts, and communication tools

### 🤖 **AI-Powered Intelligence**
- **Route Optimization**: Machine learning algorithms for efficient route planning
- **Predictive Analytics**: Maintenance scheduling and demand forecasting
- **Performance Insights**: Driver behavior analysis and safety scoring

### 🛡️ **Safety & Security**
- **Emergency SOS**: One-click emergency alerts with location sharing
- **Incident Reporting**: Comprehensive incident tracking and management
- **Geofence Monitoring**: Automated alerts for route deviations
- **Real-Time Communication**: Direct messaging between stakeholders

### 💳 **Payment & Billing**
- **Multiple Payment Gateways**: Razorpay, Stripe, and UPI integration
- **Automated Billing**: Subscription management and invoice generation
- **Payment Tracking**: Comprehensive financial reporting and analytics

### 📱 **Modern UI/UX**
- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Mode**: User preference-based theming
- **Accessibility**: WCAG 2.1 compliant interface design
- **Progressive Web App**: Offline capabilities and native app experience

## Project Structure

\`\`\`
college-transport-system/
├── frontend/
│   ├── app/
│   │   ├── landing/
│   │   ├── billing/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   └── globals.css
│   ├── components/
│   │   ├── auth/
│   │   ├── apps/
│   │   ├── dashboards/
│   │   ├── maps/
│   │   ├── payments/
│   │   ├── notifications/
│   │   └── ui/
│   ├── lib/
│   ├── hooks/
│   └── public/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Trip.js
│   │   ├── Route.js
│   │   ├── Payment.js
│   │   └── EmergencyAlert.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── tripController.js
│   │   ├── paymentController.js
│   │   ├── routeController.js
│   │   ├── emergencyController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vehicles.js
│   │   ├── trips.js
│   │   ├── payments.js
│   │   ├── routes.js
│   │   ├── emergency.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── database/
    └── seed-data.json
\`\`\`

## Installation

### Prerequisites
- Node.js 14+
- MongoDB 4.4+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env` file:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/ctms
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id/location` - Update vehicle location
- `PUT /api/vehicles/:id/status` - Update vehicle status
- `POST /api/vehicles/:id/maintenance` - Add maintenance record

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id/start` - Start trip
- `PUT /api/trips/:id/end` - End trip
- `POST /api/trips/:id/board-student` - Board student

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route details
- `POST /api/routes` - Create route
- `PUT /api/routes/:id` - Update route
- `POST /api/routes/:id/optimize` - Optimize route
- `GET /api/routes/:id/analytics` - Get route analytics

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments/history` - Get payment history
- `PUT /api/payments/:id/complete` - Complete payment
- `GET /api/payments/:id/invoice` - Generate invoice

### Emergency
- `POST /api/emergency/alert` - Create emergency alert
- `GET /api/emergency/alerts` - Get all alerts
- `PUT /api/emergency/alerts/:id/resolve` - Resolve alert

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports/daily` - Get daily report
- `GET /api/admin/reports/monthly` - Get monthly report

## Database Schema

### User
- email, password, role, name, phone, profilePhoto
- children (for parents), vehicles (for drivers)
- darkMode, notifications, biometricEnabled
- activityLogs, lastLogin, createdAt, updatedAt

### Vehicle
- registrationNumber, capacity, model, fuelType, color
- route, driver, status
- gpsLocation, speed, fuel, mileage
- lastServiceDate, nextServiceDate, insuranceExpiry
- maintenanceHistory, documents

### Trip
- vehicle, driver, route
- tripType, scheduledStartTime, actualStartTime
- students (with boarding status), status
- incidents, speedViolations, averageSpeed
- totalDistance, fuelConsumed, performanceScore

### Route
- name, stops, distance, estimatedDuration
- frequency, vehicles, students
- scheduleAM, schedulePM, fare
- optimization (efficiency, delayAverage)

### Payment
- student, amount, currency, paymentMethod
- transactionId, status, invoiceNumber
- month, subscriptionType, route

## User Roles

### Admin
- Full system access
- Create/manage routes, vehicles, drivers
- View analytics and reports
- Manage payments and subscriptions
- System settings

### Driver
- View assigned routes and trips
- Start/end trips
- Board/drop students
- View speed, fuel, mileage
- Report incidents

### Student
- Book transport
- View live tracking
- Digital pass with QR code
- Payment history
- Emergency contact

### Parent
- Track multiple children
- Driver information
- Emergency alerts
- Payment management
- Trip history

### Accountant
- Payment management
- Invoice generation
- Revenue reports
- Subscription management

### Mechanic
- Maintenance scheduling
- Vehicle service history
- Parts inventory
- Service requests

## Socket.IO Events

- `driver_location` - Real-time driver location
- `student_boarding` - Student boarding event
- `emergency_sos` - Emergency alert
- `trip_started` - Trip start event
- `trip_ended` - Trip end event
- `location_update` - Location broadcast
- `student_boarded` - Student boarded broadcast
- `emergency_alert` - Emergency alert broadcast
- `trip_update` - Trip update broadcast

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB 7.0+ (local or Atlas)
- Git for version control

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/college-transport-system.git
cd college-transport-system
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3️⃣ Frontend Setup
```bash
# In root directory
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev
```

### 4️⃣ Database Seeding
```bash
# Seed with sample data
npm run seed
```

🎉 **Access the application at `http://localhost:3000`**

---

## 🌐 Production Deployment

### Frontend Deployment (Vercel)

#### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_SOCKET_URL

# Deploy to production
vercel --prod
```

#### Method 2: GitHub Integration
1. **Push to GitHub**: Commit your code to a GitHub repository
2. **Connect Vercel**: Visit [vercel.com](https://vercel.com) and import your repository
3. **Configure Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
   ```
4. **Deploy**: Vercel automatically deploys on every push to main branch

### Backend Deployment (Render)

#### Method 1: GitHub Integration (Recommended)
1. **Push Backend**: Ensure your backend code is in a GitHub repository
2. **Create Render Service**:
   - Visit [render.com](https://render.com)
   - Create new "Web Service"
   - Connect your GitHub repository
   - Set root directory to `backend`
3. **Configure Settings**:
   ```yaml
   Build Command: npm install
   Start Command: npm start
   Environment: Node
   ```
4. **Environment Variables**:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ctms
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend.vercel.app
   PORT=10000
   ```

#### Method 2: Manual Deployment
```bash
# Build and deploy
cd backend
npm install --production
npm start
```

### Database Setup (MongoDB Atlas)

1. **Create Account**: Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. **Create Cluster**: 
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster
3. **Database Access**:
   - Create database user
   - Set username and password
   - Grant read/write access
4. **Network Access**:
   - Add IP address (0.0.0.0/0 for all IPs)
   - Or add specific IPs for security
5. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ctms?retryWrites=true&w=majority
   ```

### Payment Gateway Setup

#### Razorpay Integration
1. **Sign Up**: Create account at [razorpay.com](https://razorpay.com)
2. **Get API Keys**:
   - Navigate to Settings > API Keys
   - Generate Key ID and Key Secret
3. **Add to Environment**:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

#### Stripe Integration
1. **Sign Up**: Create account at [stripe.com](https://stripe.com)
2. **Get API Keys**:
   - Navigate to Developers > API Keys
   - Copy Publishable and Secret keys
3. **Add to Environment**:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```

---

## 🔧 Environment Configuration

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com

# Payment Gateways
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Backend (.env)
```env
# Server Configuration
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend.vercel.app

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ctms

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d

# Payment Gateways
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Email Service (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Storage (Optional)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=ctms-bucket
```

## Security Features

- JWT Authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Rate limiting (recommended)
- HTTPS enforcement (production)
- Row-level security on database

## Performance Optimization

- Real-time data with Socket.IO
- Efficient database queries with indexing
- Image optimization
- Lazy loading components
- Caching strategies
- CDN for static assets

## Monitoring & Analytics

- System health dashboard
- Real-time metrics
- User activity logs
- Trip analytics
- Route efficiency tracking
- Revenue reports
- Driver performance scores

## 🧪 Testing & Quality Assurance

### Demo Credentials
```
Admin:    admin@ctms.com    / admin123
Driver:   driver@ctms.com   / driver123
Student:  student@ctms.com  / student123
Parent:   parent@ctms.com   / parent123
```

### Testing Checklist
- [ ] Authentication flows for all roles
- [ ] Real-time tracking functionality
- [ ] Payment processing
- [ ] Emergency alert system
- [ ] Mobile responsiveness
- [ ] Socket.IO connections
- [ ] Database operations
- [ ] API endpoint responses

### Performance Monitoring
```bash
# Check application health
curl https://your-backend.onrender.com/health

# Monitor real-time connections
# Check browser DevTools > Network > WS for Socket.IO
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow
1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/college-transport-system.git
   cd college-transport-system
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test Thoroughly**
   ```bash
   npm run test
   npm run lint
   ```

5. **Commit & Push**
   ```bash
   git commit -m 'feat: add amazing feature'
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Provide clear description
   - Include screenshots if UI changes
   - Link related issues

### Code Style Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

---

## 📊 System Architecture

```mermaid
graph TB
    A[Frontend - Next.js] --> B[API Gateway]
    B --> C[Backend - Node.js/Express]
    C --> D[MongoDB Database]
    C --> E[Socket.IO Server]
    E --> A
    C --> F[Payment Gateway]
    C --> G[Email Service]
    C --> H[File Storage]
    
    subgraph "Deployment"
        I[Vercel - Frontend]
        J[Render - Backend]
        K[MongoDB Atlas]
    end
```

### Technology Stack

#### Frontend
- **Framework**: Next.js 16.0 with App Router
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: React Context + Local Storage
- **Real-time**: Socket.IO Client
- **Charts**: Recharts
- **UI Components**: Radix UI + Custom Components

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO Server
- **File Upload**: Multer + AWS S3

#### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database**: MongoDB Atlas
- **CDN**: Vercel Edge Network
- **Monitoring**: Built-in health checks

---

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt (12 rounds)
- Session management and timeout

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Content Security Policy
- CORS configuration for cross-origin requests

### API Security
- Rate limiting to prevent abuse
- Request size limits
- HTTPS enforcement in production
- API key validation for external services

### Privacy Compliance
- GDPR-compliant data handling
- User consent management
- Data encryption at rest and in transit
- Audit logs for sensitive operations

---

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component with WebP
- **Caching**: Browser caching + CDN edge caching
- **Bundle Analysis**: Webpack bundle analyzer integration

### Backend Optimizations
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: MongoDB connection pool management
- **Caching Strategy**: Redis for session and data caching
- **Compression**: Gzip compression for API responses

### Real-time Performance
- **Socket.IO Optimization**: Room-based event broadcasting
- **Data Throttling**: Limit real-time update frequency
- **Connection Management**: Automatic reconnection handling

---

## 🛠️ Troubleshooting Guide

### Common Issues

#### Frontend Issues
```bash
# Build errors
npm run build
# If errors, clear cache
rm -rf .next node_modules
npm install

# API connection issues
# Check NEXT_PUBLIC_API_URL in .env.local
# Verify backend is running
```

#### Backend Issues
```bash
# MongoDB connection errors
# Check MONGODB_URI format
# Verify network access in MongoDB Atlas

# Port conflicts
# Change PORT in .env
# Kill existing processes: lsof -i :5000
```

#### Deployment Issues
```bash
# Vercel deployment fails
vercel logs
# Check build logs and environment variables

# Render deployment fails
# Check build and start commands
# Verify environment variables
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check Socket.IO connections
# Browser DevTools > Network > WS
```

---

## 📞 Support & Community

### Getting Help
- **Documentation**: Check this README and setup guides
- **Issues**: Create GitHub issue with detailed description
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@ctms.com for urgent issues

### Community
- **Discord**: [Join our Discord server](https://discord.gg/ctms)
- **Twitter**: [@CTMSOfficial](https://twitter.com/ctmsofficial)
- **LinkedIn**: [CTMS LinkedIn Page](https://linkedin.com/company/ctms)

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- [x] Core transportation management
- [x] Real-time tracking
- [x] Multi-role dashboards
- [x] Payment integration
- [x] Emergency features

### Phase 2 (Q2 2024) 🚧
- [ ] Mobile applications (iOS & Android)
- [ ] Advanced AI predictions
- [ ] Voice-based assistance
- [ ] Offline mode support
- [ ] Multi-language support

### Phase 3 (Q3 2024) 📋
- [ ] IoT sensor integration
- [ ] Blockchain transparency
- [ ] Advanced analytics dashboard
- [ ] Third-party integrations
- [ ] White-label solutions

### Phase 4 (Q4 2024) 🔮
- [ ] Multi-campus expansion
- [ ] Enterprise features
- [ ] Advanced reporting
- [ ] Custom branding
- [ ] API marketplace

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Commercial Use
Free for educational and non-commercial use. For commercial licensing, contact us at licensing@ctms.com.

---

<div align="center">
  <h3>🌟 Star this repository if you find it helpful!</h3>
  <p>Made with ❤️ by the CTMS Team</p>
  
  <a href="https://github.com/your-username/college-transport-system/stargazers">
    <img src="https://img.shields.io/github/stars/your-username/college-transport-system?style=social" alt="GitHub stars" />
  </a>
  <a href="https://github.com/your-username/college-transport-system/network/members">
    <img src="https://img.shields.io/github/forks/your-username/college-transport-system?style=social" alt="GitHub forks" />
  </a>
  <a href="https://github.com/your-username/college-transport-system/issues">
    <img src="https://img.shields.io/github/issues/your-username/college-transport-system" alt="GitHub issues" />
  </a>
</div>

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, email support@ctms.com or open an issue in the repository.

## Roadmap

- Mobile app (iOS & Android)
- Advanced AI predictions
- Blockchain for transparency
- IoT integration for sensors
- Voice-based assistance
- Multi-language support
- Expansion to multiple campuses
