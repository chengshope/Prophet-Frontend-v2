import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';

import Competitors from '@/pages/Competitors';
import ExistingCustomers from '@/pages/ExistingCustomers';
import ForgotPassword from '@/pages/ForgotPassword';
import Loading from '@/pages/Loading';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Portfolio from '@/pages/Portfolio';
import Reporting from '@/pages/Reporting';
import ResetPassword from '@/pages/ResetPassword';
import Settings from '@/pages/Settings';
import StreetRates from '@/pages/StreetRates';

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
      { path: 'login', element: <Login /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
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
      { index: true, element: <StreetRates /> },
      { path: 'loading', element: <Loading /> },
      { path: 'street-rates', element: <StreetRates /> },
      { path: 'existing-customer-rate-increases', element: <ExistingCustomers /> },
      { path: 'competitors', element: <Competitors /> },
      { path: 'competitors/:id', element: <Competitors /> },
      { path: 'reporting/*', element: <Reporting /> },
      { path: 'settings', element: <Settings /> },
      { path: 'settings/:id', element: <Settings /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'portfolio/:id', element: <Portfolio /> },
    ],
  },
  { path: '404', element: <NotFound /> },
  { path: '*', element: <NotFound /> },
];
