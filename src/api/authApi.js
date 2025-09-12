import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: {
          email: data.email,
        },
      }),
    }),

    // Reset password endpoint
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/users/password',
        method: 'PUT',
        body: {
          user: {
            password_confirmation: data.password_confirmation,
            password: data.password,
            reset_password_token: data.token,
          },
        },
      }),
    }),

    // Logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: '/users/sign_out',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Get current user
    getCurrentUser: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useOnboardingMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
