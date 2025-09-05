// Route configuration inspired by React Router v7 style
import { Navigate } from 'react-router-dom';

// Layouts
import ProtectedRoute from '../components/ProtectedRoute';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';

// Auth Pages
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import LoginPage from '../pages/auth/LoginPage';

// Main Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import CounterDemoPage from '../pages/demo/CounterDemoPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProfilePage from '../pages/profile/ProfilePage';
import SettingsPage from '../pages/settings/SettingsPage';

// Demo Pages

// Error Pages

// Protected Route Component

// Helper functions to create route configurations
export const route = (path, element, options = {}) => ({
  path,
  element,
  ...options,
});

export const index = (element, options = {}) => ({
  index: true,
  element,
  ...options,
});

export const layout = (layoutComponent, children) => ({
  path: '/',
  element: layoutComponent,
  children,
});

export const prefix = (pathPrefix, routes) =>
  routes.map((route) => ({
    ...route,
    path: route.index
      ? undefined
      : `${pathPrefix}/${route.path}`.replace(/\/+/g, '/'),
  }));

export const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

// Route configuration
export const routeConfig = [
  // Root redirect
  route('', <Navigate to="/login" replace />),

  // Auth routes with auth layout
  layout(<AuthLayout />, [
    route('login', <LoginPage />),
    route('forgot-password', <ForgotPasswordPage />),
  ]),

  // Main app routes with main layout (protected)
  layout(protect(<MainLayout />), [
    index(protect(<DashboardPage />)),
    route('dashboard', protect(<DashboardPage />)),

    // Profile routes
    ...prefix('profile', [
      index(protect(<ProfilePage />)),
      route('settings', protect(<SettingsPage />)),
    ]),

    // Demo routes
    ...prefix('demo', [route('counter', protect(<CounterDemoPage />))]),
  ]),

  // 404 and catch-allF
  route('404', <NotFoundPage />),
  route('*', <NotFoundPage />),
];
