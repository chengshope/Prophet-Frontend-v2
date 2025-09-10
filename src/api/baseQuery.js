import { removeApiToken } from '@/features/auth/authSlice';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { message } from 'antd';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_HOST || '/',
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state.apiToken?.token;
    if (token) {
      headers.set('X-API-Token', token);
    }
    return headers;
  },
});

export const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (
    result.data &&
    typeof result.data === 'object' &&
    'success' in result.data &&
    result.data.success === false
  ) {
    const data = result.data;

    if (data.message) {
      message.error(data.message);
    } else if (data.errors) {
      const errorMessage = Array.isArray(data.errors) ? data.errors.join(', ') : data.errors;
      message.error(errorMessage);
    } else {
      message.error('Operation failed. Please try again.');
    }
  }

  if (result.error) {
    const { status, data } = result.error;

    switch (status) {
      case 401:
        api.dispatch(removeApiToken());
        message.error('Session expired. Please log in again.');
        break;

      case 403:
        message.error('Access denied. You do not have permission to perform this action.');
        break;

      case 404:
        message.error('Resource not found. Please try again.');
        break;

      case 422:
        if (data?.errors) {
          const errorMessage = Array.isArray(data.errors) ? data.errors.join(', ') : data.errors;
          message.error(errorMessage);
        } else if (data?.message) {
          message.error(data.message);
        } else {
          message.error('Validation failed. Please check your input.');
        }
        break;

      default:
        if (status === undefined) {
          message.error('Network error. Please check your connection and try again.');
        } else if (status >= 500) {
          message.error('Server error. Please try again later.');
        } else {
          if (data?.message) {
            message.error(data.message);
          } else if (data?.errors) {
            const errorMessage = Array.isArray(data.errors) ? data.errors.join(', ') : data.errors;
            message.error(errorMessage);
          } else {
            message.error('Something went wrong. Please try again.');
          }
        }
        break;
    }
  }

  return result;
};
