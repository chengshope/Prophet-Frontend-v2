import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/api/authApi';
import { facilitiesApi } from '@/api/facilitiesApi';
import { reportingApi } from '@/api/reportingApi';
import { streetRatesApi } from '@/api/streetRatesApi';
import { settingsApi } from '@/api/settingsApi';
import { syncDataApi } from '@/api/syncDataApi';
import existingCustomersApi from '@/api/existingCustomersApi';
import competitorsApi from '@/api/competitorsApi';
import authReducer from '@/features/auth/authSlice';
import streetReducer from '@/features/street/streetSlice';
import existingCustomersReducer from '@/features/existingCustomers/existingCustomersSlice';
import reportingReducer from '@/features/reporting/reportingSlice';
import competitorsReducer from '@/features/competitors/competitorsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [reportingApi.reducerPath]: reportingApi.reducer,
    [facilitiesApi.reducerPath]: facilitiesApi.reducer,
    [streetRatesApi.reducerPath]: streetRatesApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [syncDataApi.reducerPath]: syncDataApi.reducer,
    [existingCustomersApi.reducerPath]: existingCustomersApi.reducer,
    [competitorsApi.reducerPath]: competitorsApi.reducer,
    auth: authReducer,
    street: streetReducer,
    existingCustomers: existingCustomersReducer,
    reporting: reportingReducer,
    competitors: competitorsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      reportingApi.middleware,
      facilitiesApi.middleware,
      streetRatesApi.middleware,
      settingsApi.middleware,
      syncDataApi.middleware,
      existingCustomersApi.middleware,
      competitorsApi.middleware
    ),
});

export default store;
