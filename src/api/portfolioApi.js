import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery,
  tagTypes: ['UserList'],
  endpoints: (builder) => ({
    getPortfolioCustomerUsers: builder.query({
      query: ({ portfolioId }) => `/customers/users?portfolio_id=${portfolioId}&role_id=1`,
      transformResponse: (response) => response.result || response,
      providesTags: (result, error, { portfolioId }) => [{ type: 'UserList', id: portfolioId }],
    }),

    createPortfolioUser: builder.mutation({
      query: (userData) => ({
        url: '/customers/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: (result, error, { portfolio_id }) => [
        { type: 'UserList', id: portfolio_id },
      ],
    }),

    deletePortfolioUser: builder.mutation({
      query: (userId) => ({
        url: `/customers/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { portfolio_id }) => [
        { type: 'UserList', id: portfolio_id },
      ],
    }),
  }),
});

export const {
  useGetPortfolioCustomerUsersQuery,
  useCreatePortfolioUserMutation,
  useDeletePortfolioUserMutation,
} = portfolioApi;
