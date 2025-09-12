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
});

export const baseQuery = async (args, api, extraOptions) => {
  const res = await rawBaseQuery(args, api, extraOptions);

  // Handle HTTP / API errors
  if (res.error) {
    const { status, data } = res.error;
    const message = data?.error || data?.message || 'Something went wrong';

    switch (status) {
      case 401:
        api.dispatch(removeApiToken());
        showError(message || 'Session expired. Please log in again.');
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

  // Success: unwrap "result" from API response
  if (res.data && typeof res.data === 'object' && 'result' in res.data) {
    return { data: res.data.result };
  }

  // Fallback: return raw data if "result" is missing
  return { data: res.data };
};
