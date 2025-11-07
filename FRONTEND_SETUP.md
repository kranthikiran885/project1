# Frontend Setup Guide

## Prerequisites

- Node.js v16 or higher
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Environment Configuration

Create `.env.local` file in root directory:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxx
NEXT_PUBLIC_STRIPE_KEY=pk_test_xxxxx
\`\`\`

### 3. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Frontend runs on `http://localhost:3000`

## Features Overview

### Landing Page
- Hero section with animations
- Features showcase with images
- Pricing plans
- Testimonials
- Call-to-action sections

### Authentication
- Role-based login (Admin, Driver, Student, Parent, Accountant, Mechanic)
- Splash screen with animations
- Onboarding flow
- Demo credentials available

### Student Portal
- Bus booking interface
- Real-time tracking with live map
- ETA calculation
- Digital pass with QR code
- Payment history
- Favorites system

### Driver Dashboard
- Trip management
- Student manifest
- OTP verification for boarding
- Speed monitoring (speedometer)
- Fuel level tracking
- Emergency SOS button

### Parent Portal
- Multi-child tracking
- Real-time GPS location
- Driver information display
- Emergency alert system
- Incident history
- Trip reports

### Admin Dashboard
- Comprehensive analytics
- Vehicle management
- Route optimization
- Payment tracking
- Safety alerts
- Performance metrics

## Component Structure

\`\`\`
components/
├── auth/
│   ├── splash-screen.jsx
│   ├── login-page.jsx
│   └── onboarding-flow.jsx
├── apps/
│   ├── student-app.jsx
│   ├── driver-app.jsx
│   └── parent-portal.jsx
├── dashboards/
│   ├── admin-dashboard.jsx
│   ├── metrics-grid.jsx
│   ├── realtime-map.jsx
│   ├── analytics-section.jsx
│   ├── vehicle-management.jsx
│   ├── payments-section.jsx
│   ├── safety-alerts.jsx
│   └── route-optimization.jsx
├── maps/
│   ├── advanced-realtime-map.jsx
│   └── 3d-bus-animation.jsx
├── payments/
│   ├── payment-modal.jsx
│   └── advanced-payment-portal.jsx
└── ui/
    └── [shadcn components]
\`\`\`

## Styling System

### Color Palette
- Primary: Orange (#ff6b35)
- Secondary: Cyan (#00d9ff)
- Accent: Purple (#7c3aed)
- Success: Green (#10b981)
- Background: Dark navy (#0f172a)

### Typography
- Heading: Geist (sans-serif)
- Body: Geist (sans-serif)
- Font sizes follow Tailwind scale

### Layout
- Mobile-first responsive design
- Flexbox for most layouts
- CSS Grid for complex 2D layouts
- Spacing using Tailwind scale (4px units)

## State Management

### LocalStorage
- User authentication data
- User preferences (dark mode, notifications)
- Demo data storage

### Real-Time Updates
- Socket.IO for live tracking
- Real-time notifications
- Live map updates

## Key Pages

### /
- Landing page with features and CTAs

### /login
- Multi-role login
- Demo credentials display

### /admin
- Admin dashboard
- Analytics and reports
- System management

### /student
- Student portal
- Bus booking
- Live tracking

### /driver
- Driver dashboard
- Trip management
- Student manifest

### /parent
- Parent portal
- Child tracking
- Emergency alerts

### /billing
- Payment management
- Invoice history
- Subscription plans

## Development Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
\`\`\`

## Customization

### Themes
Modify colors in `app/globals.css`:
\`\`\`css
:root {
  --color-primary: #ff6b35;
  --color-secondary: #00d9ff;
  --color-accent: #7c3aed;
}
\`\`\`

### Images
Replace demo images in `public/` directory:
- College transport bus images
- GPS tracking screenshots
- Safety alert visuals
- Dashboard analytics

## Performance Optimization

- Image optimization with Next.js Image component
- Lazy loading for components
- Code splitting with dynamic imports
- CSS-in-JS optimization
- Bundle size monitoring

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Change port
npm run dev -- -p 3001
\`\`\`

### API Connection Error
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure CORS is properly configured

### Build Errors
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run build
\`\`\`

## Testing

### Manual Testing
- Test all authentication flows
- Verify real-time tracking
- Check payment integration
- Test emergency alerts
- Validate responsive design

### Browser DevTools
- Check Network tab for API calls
- Monitor Socket.IO connections
- Verify data in LocalStorage
- Test performance metrics

## Deployment

### Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

### Netlify
\`\`\`bash
# Build
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=.next
\`\`\`

### GitHub Pages
Not recommended for Next.js with API routes. Use Vercel or Netlify.

## Production Checklist

- [ ] Environment variables configured
- [ ] Backend API URL updated
- [ ] Images optimized
- [ ] Bundle size reviewed
- [ ] Performance metrics checked
- [ ] SEO meta tags added
- [ ] Security headers configured
- [ ] Error logging set up

## Support & Resources

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com
- Recharts: https://recharts.org
- Socket.IO Client: https://socket.io/docs/v4/client-api/
