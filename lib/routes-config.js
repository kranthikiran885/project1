// Centralized routing configuration for CTMS 2.0

export const ROUTES = {
  // Public routes
  HOME: "/",
  LANDING: "/landing",
  SPLASH: "/splash",
  ONBOARDING: "/onboarding",
  AUTH: "/auth",
  BILLING: "/billing",

  // Dashboard routes - Role-based
  DASHBOARD: {
    STUDENT: "/dashboard/student",
    DRIVER: "/dashboard/driver",
    PARENT: "/dashboard/parent",
    ADMIN: "/dashboard/admin",
    BASE: "/dashboard",
  },

  // Feature routes
  FEATURES: {
    ANALYTICS: "/dashboard/analytics",
    TRACKING: "/dashboard/tracking",
    VEHICLES: "/dashboard/vehicles",
    ROUTES: "/dashboard/routes",
    SAFETY: "/dashboard/safety",
    PAYMENTS: "/dashboard/payments",
  },

  // Other routes
  MAPS: "/maps",
  PAYMENTS_PORTAL: "/payments",
  INVOICES: "/invoices",
}

// Navigation menu items for landing page
export const LANDING_NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/billing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

// Dashboard navigation items
export const DASHBOARD_NAV_ITEMS = {
  admin: [
    { label: "Overview", href: ROUTES.DASHBOARD.ADMIN, icon: "BarChart3" },
    { label: "Analytics", href: ROUTES.FEATURES.ANALYTICS, icon: "TrendingUp" },
    { label: "Tracking", href: ROUTES.FEATURES.TRACKING, icon: "MapPin" },
    { label: "Vehicles", href: ROUTES.FEATURES.VEHICLES, icon: "Bus" },
    { label: "Routes", href: ROUTES.FEATURES.ROUTES, icon: "Activity" },
    { label: "Safety", href: ROUTES.FEATURES.SAFETY, icon: "AlertCircle" },
    { label: "Payments", href: ROUTES.FEATURES.PAYMENTS, icon: "DollarSign" },
  ],
  student: [
    { label: "Dashboard", href: ROUTES.DASHBOARD.STUDENT, icon: "Home" },
    { label: "Booking", href: ROUTES.DASHBOARD.STUDENT, icon: "Bus" },
    { label: "Tracking", href: ROUTES.FEATURES.TRACKING, icon: "MapPin" },
    { label: "Payments", href: ROUTES.FEATURES.PAYMENTS, icon: "DollarSign" },
  ],
  driver: [
    { label: "Dashboard", href: ROUTES.DASHBOARD.DRIVER, icon: "Home" },
    { label: "Tracking", href: ROUTES.FEATURES.TRACKING, icon: "MapPin" },
    { label: "Map", href: ROUTES.MAPS, icon: "Map" },
    { label: "Safety", href: ROUTES.FEATURES.SAFETY, icon: "AlertCircle" },
  ],
  parent: [
    { label: "Dashboard", href: ROUTES.DASHBOARD.PARENT, icon: "Home" },
    { label: "Tracking", href: ROUTES.FEATURES.TRACKING, icon: "MapPin" },
    { label: "Alerts", href: ROUTES.FEATURES.SAFETY, icon: "AlertCircle" },
    { label: "Payments", href: ROUTES.FEATURES.PAYMENTS, icon: "DollarSign" },
  ],
}

// CTA buttons
export const CTA_ROUTES = {
  GET_STARTED: ROUTES.AUTH,
  START_TRIAL: ROUTES.AUTH,
  WATCH_DEMO: "#demo",
  PRICING: ROUTES.BILLING,
}
