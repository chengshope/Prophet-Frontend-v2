import { removeApiToken } from '@/features/auth/authSlice';
import { showError } from '@/utils/messageService';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_BACKEND_HOST || '/'}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  timeout: 60 * 1000, // Set a long timeout for the Sync-data API call
});

// Track if we've already shown a 401 error to prevent duplicate notifications
let isHandling401 = false;

export const baseQuery = async (args, api, extraOptions) => {
  const res = await rawBaseQuery(args, api, extraOptions);

  if (res.error) {
    const { status, data, error } = res.error;
    const message = data?.error || data?.message || error || 'Something went wrong';

    switch (status) {
      case 'TIMEOUT_ERROR':
        showError('Request timed out. Please try again.');
        break;

      case 'FETCH_ERROR':
        showError('Network error. Check your connection.');
        break;

      case 401:
        // Only show error and dispatch logout once, even if multiple requests fail
        if (!isHandling401) {
          isHandling401 = true;
          api.dispatch(removeApiToken());
          showError('Session expired. Please log in again.');

          // Reset the flag after a short delay to allow for edge cases
          setTimeout(() => {
            isHandling401 = false;
          }, 1000);
        }
        break;

      case 403:
        showError(message || 'Access denied.');
        break;

      case 404:
        showError(message || 'Resource not found.');
        break;

      case 422:
        if (data?.errors) {
          showError(Array.isArray(data.errors) ? data.errors.join(', ') : data.errors);
        } else {
          showError(message);
        }
        break;

      default:
        showError(message);
        break;
    }

    return { error: res.error };
  }

  if (res.data && typeof res.data === 'object' && 'result' in res.data) {
    if (res.data.pagination) {
      return { data: res.data };
    }
    return { data: res.data.result };
  }

  return { data: res.data };
};
