import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';

import CompetitorsPage from '@/pages/CompetitorsPage';
import DashboardPage from '@/pages/DashboardPage';
import ExistingCustomersPage from '@/pages/ExistingCustomersPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProfilePage from '@/pages/ProfilePage';
import ReportingPage from '@/pages/ReportingPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import SettingsPage from '@/pages/SettingsPage';
import StreetRatesPage from '@/pages/StreetRatesPage';

export const routeConfig = [
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'street-rates', element: <StreetRatesPage /> },
      { path: 'existing-customer-rate-increases', element: <ExistingCustomersPage /> },
      { path: 'competitors', element: <CompetitorsPage /> },
      { path: 'competitors/:id', element: <CompetitorsPage /> },
      { path: 'reporting', element: <ReportingPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'portfolio/:id', element: <PortfolioPage /> },

      {
        path: 'profile',
        children: [
          { index: true, element: <ProfilePage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '404', element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
];
