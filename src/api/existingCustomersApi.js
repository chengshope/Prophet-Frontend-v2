import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const existingCustomersApi = createApi({
  reducerPath: 'existingCustomersApi',
  baseQuery,
  tagTypes: ['ExistingCustomers', 'Summary'],
  endpoints: (builder) => ({
    getExistingCustomers: builder.query({
      query: (params = {}) => ({ url: 'ecri', params }),
      providesTags: ['ExistingCustomers'],
    }),

    getExistingCustomersSummary: builder.query({
      query: () => 'ecri/summary',
      providesTags: ['Summary'],
    }),

    bulkUpdateTenants: builder.mutation({
      query: (tenants) => ({
        url: 'ecri/bulk-update',
        method: 'POST',
        body: tenants,
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    publishAllRateChanges: builder.mutation({
      query: (ecriIds) => ({
        url: 'ecri/publish',
        method: 'POST',
        body: { ecri_ids: ecriIds },
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    publishIndividualRateChanges: builder.mutation({
      query: ({ facilityId, ecriIds }) => ({
        url: 'ecri/publish-individual',
        method: 'POST',
        body: {
          facility_id: facilityId,
          ecri_ids: ecriIds,
        },
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    refreshModel: builder.mutation({
      query: () => ({
        url: 'ecri/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),
  }),
});

export const {
  useGetExistingCustomersQuery,
  useGetExistingCustomersSummaryQuery,
  useBulkUpdateTenantsMutation,
  usePublishAllRateChangesMutation,
  usePublishIndividualRateChangesMutation,
  useRefreshModelMutation,
} = existingCustomersApi;
