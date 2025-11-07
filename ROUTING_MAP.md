# CTMS 2.0 - Complete Routing Map

## Public Routes

### Landing & Authentication
- **`/`** - Home page (Landing page with features)
- **`/landing`** - Landing page
- **`/splash`** - Splash screen with animation
- **`/onboarding`** - Onboarding flow (5 steps)
- **`/auth`** - Login page (Multi-role selection)
- **`/billing`** - Billing & Payments page

## Protected Routes (Require Authentication)

### Dashboard Routes - Role Based
- **`/dashboard/student`** - Student App
  - Bus booking
  - Real-time tracking
  - QR code pass
  - Payment history
  - Favorites system

- **`/dashboard/driver`** - Driver Dashboard
  - Trip management
  - Student manifest
  - OTP verification
  - Speed monitoring
  - Emergency SOS

- **`/dashboard/parent`** - Parent Portal
  - Multi-child tracking
  - GPS location display
  - Driver information
  - Emergency alerts
  - Trip reports

- **`/dashboard/admin`** - Admin Dashboard
  - System overview
  - User management
  - Vehicle management
  - Route management
  - Analytics & reports
  - Payment management
  - Safety monitoring

### Feature Routes (Sub-dashboards)
- **`/dashboard/analytics`** - Advanced Analytics Portal
  - Metrics & KPIs
  - Trip analytics
  - Revenue reports
  - Safety scores
  - Data export

- **`/dashboard/tracking`** - Real-Time Tracking
  - Live bus tracking
  - Vehicle locations
  - Route visualization
  - ETA calculations
  - Speed monitoring

- **`/dashboard/vehicles`** - Vehicle Management
  - Fleet overview
  - Vehicle details
  - Maintenance history
  - Status monitoring
  - Document management

- **`/dashboard/routes`** - Route Optimization
  - Route management
  - Optimization algorithms
  - Stop management
  - Schedule management
  - Efficiency analysis

- **`/dashboard/safety`** - Safety Alerts
  - Emergency alerts
  - Incident reporting
  - Geofence monitoring
  - Alert history
  - Safety statistics

- **`/dashboard/payments`** - Payments Dashboard
  - Payment tracking
  - Invoice management
  - Subscription management
  - Revenue analytics
  - Payment history

### Other Feature Routes
- **`/maps`** - Real-Time Map View
  - Live GPS tracking
  - 3D bus animation
  - Route visualization
  - Traffic information

- **`/payments`** - Advanced Payment Portal
  - Payment processing
  - Multiple payment methods
  - Subscription management
  - Invoice generation

- **`/invoices`** - Invoice Generator
  - Invoice creation
  - Invoice history
  - PDF download
  - Email invoice

## Authentication Flow

1. `/` → Home (Landing Page)
2. `/auth` → Login (Select role)
3. `/dashboard/{role}` → Role-specific dashboard
4. Alternative: `/splash` → `/onboarding` → `/auth`

## Demo Credentials

### Admin
- Email: `admin@ctms.com`
- Password: `admin123`
- Route: `/dashboard/admin`

### Driver
- Email: `driver@ctms.com`
- Password: `driver123`
- Route: `/dashboard/driver`

### Student
- Email: `student@ctms.com`
- Password: `student123`
- Route: `/dashboard/student`

### Parent
- Email: `parent@ctms.com`
- Password: `parent123`
- Route: `/dashboard/parent`

## Route Protection

All routes with `/dashboard/` prefix are protected:
- Checks for authentication token in localStorage
- Redirects to `/auth` if not authenticated
- Validates user role matches route
- Redirects to correct dashboard if role mismatch

## Navigation Configuration

Routes are centralized in `lib/routes-config.js`:

```javascript
import { ROUTES } from '@/lib/routes-config'

// Usage
<Link href={ROUTES.DASHBOARD.ADMIN} />
<Link href={ROUTES.FEATURES.TRACKING} />
<Link href={ROUTES.MAPS} />
```

## Component Structure

```
app/
├── page.jsx → /
├── landing/
│   └── page.jsx → /landing
├── splash/
│   └── page.jsx → /splash
├── onboarding/
│   └── page.jsx → /onboarding
├── auth/
│   └── page.jsx → /auth
├── billing/
│   └── page.jsx → /billing
├── dashboard/
│   ├── layout.jsx (Auth check & layout)
│   ├── student/
│   │   └── page.jsx → /dashboard/student
│   ├── driver/
│   │   └── page.jsx → /dashboard/driver
│   ├── parent/
│   │   └── page.jsx → /dashboard/parent
│   ├── admin/
│   │   └── page.jsx → /dashboard/admin
│   ├── analytics/
│   │   └── page.jsx → /dashboard/analytics
│   ├── tracking/
│   │   └── page.jsx → /dashboard/tracking
│   ├── vehicles/
│   │   └── page.jsx → /dashboard/vehicles
│   ├── routes/
│   │   └── page.jsx → /dashboard/routes
│   ├── safety/
│   │   └── page.jsx → /dashboard/safety
│   └── payments/
│       └── page.jsx → /dashboard/payments
├── maps/
│   └── page.jsx → /maps
├── payments/
│   └── page.jsx → /payments
├── invoices/
│   └── page.jsx → /invoices
├── layout.jsx (Root layout)
└── globals.css (Global styles)
```

## Environment Setup

Frontend routes are fully client-side with Next.js App Router.

Backend API routes:
- `/api/auth` - Authentication endpoints
- `/api/vehicles` - Vehicle management
- `/api/trips` - Trip management
- `/api/routes` - Route management
- `/api/payments` - Payment processing
- `/api/emergency` - Emergency alerts
- `/api/admin` - Admin operations

## Socket.IO Real-Time Events

Enabled on all dashboard pages for live updates:
- `driver_location` - Real-time GPS tracking
- `student_boarding` - Boarding events
- `emergency_sos` - Emergency alerts
- `trip_started/ended` - Trip lifecycle events

## Performance Optimization

- Route-based code splitting
- Lazy loading of dashboard components
- Protected route validation in layouts
- Client-side navigation with smooth transitions
