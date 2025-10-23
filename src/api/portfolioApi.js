import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery,
  tagTypes: ['UserList', 'CompList', 'PortfolioList'],
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

    getPortfolioFacilities: builder.query({
      query: (portfolioId) => `/portfolio/${portfolioId}/facility/list`,
      transformResponse: (response) => response.result || response,
      providesTags: ['CompList'],
    }),

    updateCompetitorStore: builder.mutation({
      query: ({ storeid, storeData }) => ({
        url: `/comp_stores/${storeid}`,
        method: 'POST',
        body: storeData,
      }),
    }),

    updateFacilityStorTrack: builder.mutation({
      query: ({ facilityId, stortrack_id, radius }) => ({
        url: `/facility_profile/update-facility/${facilityId}`,
        method: 'PUT',
        body: {
          stortrack_id,
          stortrack_radius: radius,
        },
      }),
      invalidatesTags: ['CompList'],
    }),

    getPortfoliosList: builder.query({
      query: () => '/portfolio/list',
      transformResponse: (response) => response.result || response,
      providesTags: ['PortfolioList'],
    }),

    createPortfolioAndUsers: builder.mutation({
      query: (portfolioData) => ({
        url: '/portfolio/add',
        method: 'POST',
        body: portfolioData,
      }),
      invalidatesTags: ['PortfolioList'],
    }),

    getPortfolioCompanies: builder.query({
      query: () => '/portfolio/storEdge/companies',
    }),
  }),
});

export const {
  useGetPortfolioCustomerUsersQuery,
  useCreatePortfolioUserMutation,
  useDeletePortfolioUserMutation,
  useUpdateCompetitorStoreMutation,
  useUpdateFacilityStorTrackMutation,
  useGetPortfolioFacilitiesQuery,
  useGetPortfoliosListQuery,
  useGetPortfolioCompaniesQuery,
  useCreatePortfolioAndUsersMutation,
} = portfolioApi;
