import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const existingCustomersApi = createApi({
  reducerPath: 'existingCustomersApi',
  baseQuery,
  tagTypes: ['ExistingCustomers', 'Summary'],
  endpoints: (builder) => ({
    // Get existing customers with pagination and search (matching v1 API)
    getExistingCustomers: builder.query({
      query: ({ page = 1, search = '', sort = 'facility_name', orderby = 'asc', limit = 10 }) => {
        const searchParams = new URLSearchParams();

        if (page) searchParams.append('page', page);
        if (search) searchParams.append('search', search);
        if (sort) searchParams.append('sort', sort);
        if (orderby) searchParams.append('orderby', orderby);
        if (limit) searchParams.append('limit', limit);
        searchParams.append('status', 'enabled');

        return `ecri?${searchParams.toString()}`;
      },
      providesTags: ['ExistingCustomers'],
    }),

    // Get summary data
    getExistingCustomersSummary: builder.query({
      query: () => 'ecri/summary',
      providesTags: ['Summary'],
    }),

    // Bulk update tenants (matching v1 API format)
    bulkUpdateTenants: builder.mutation({
      query: (tenants) => ({
        url: 'ecri/bulk-update',
        method: 'POST',
        body: tenants, // v1 sends array directly, not wrapped in object
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    // Publish all rate changes
    publishAllRateChanges: builder.mutation({
      query: (ecriIds) => ({
        url: 'ecri/publish',
        method: 'POST',
        body: { ecri_ids: ecriIds },
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    // Publish individual facility rate changes
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

    // Refresh model (matching v1 functionality)
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

export default existingCustomersApi;
