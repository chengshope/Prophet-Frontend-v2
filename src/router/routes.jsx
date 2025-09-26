import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';

const Competitors = lazy(() => import('@/pages/Competitors'));
const ExistingCustomers = lazy(() => import('@/pages/ExistingCustomers'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const Loading = lazy(() => import('@/pages/Loading'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const Reporting = lazy(() => import('@/pages/Reporting'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const Settings = lazy(() => import('@/pages/Settings'));
const StreetRates = lazy(() => import('@/pages/StreetRates'));

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
