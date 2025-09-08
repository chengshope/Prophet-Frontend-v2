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
        url: '/users/sign_in',
        method: 'POST',
        body: {
          user: {
            email: credentials.email,
            password: credentials.password,
          },
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Signup endpoint
    signup: builder.mutation({
      query: (userData) => ({
        url: '/users/sign_up',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Onboarding endpoint
    onboarding: builder.mutation({
      query: (data) => ({
        url: '/users/onboarding',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // Forgot password endpoint
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/users/password',
        method: 'POST',
        body: {
          user: {
            email: data.email,
          },
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

    // Google login endpoint
    googleLogin: builder.mutation({
      query: (data) => ({
        url: '/users/google_sign_in',
        method: 'POST',
        body: {
          credential: data.credential,
          user_info: data.userInfo,
        },
      }),
      invalidatesTags: ['User'],
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
