import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { facilitiesApi } from '../api/facilitiesApi';
import { reportingApi } from '../api/reportingApi';
import { streetRatesApi } from '../api/streetRatesApi';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [reportingApi.reducerPath]: reportingApi.reducer,
    [facilitiesApi.reducerPath]: facilitiesApi.reducer,
    [streetRatesApi.reducerPath]: streetRatesApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      reportingApi.middleware,
      facilitiesApi.middleware,
      streetRatesApi.middleware
    ),
});

export default store;
