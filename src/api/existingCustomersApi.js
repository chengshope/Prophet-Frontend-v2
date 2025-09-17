import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const existingCustomersApi = createApi({
  reducerPath: 'existingCustomersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/ecri',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ExistingCustomers', 'Summary'],
  endpoints: (builder) => ({
    // Get existing customers with pagination and search
    getExistingCustomers: builder.query({
      query: ({ page = 1, search = '', sort = 'facility_name', orderby = 'asc' }) => ({
        url: '/',
        params: {
          page,
          search,
          sort,
          orderby,
        },
      }),
      providesTags: ['ExistingCustomers'],
    }),

    // Get summary data
    getExistingCustomersSummary: builder.query({
      query: () => '/summary',
      providesTags: ['Summary'],
    }),

    // Bulk update tenants
    bulkUpdateTenants: builder.mutation({
      query: (tenants) => ({
        url: '/bulk-update',
        method: 'POST',
        body: { tenants },
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    // Publish all rate changes
    publishAllRateChanges: builder.mutation({
      query: (ecriIds) => ({
        url: '/publish',
        method: 'POST',
        body: { ecri_ids: ecriIds },
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    // Publish individual facility rate changes
    publishIndividualRateChanges: builder.mutation({
      query: ({ facilityId, ecriIds }) => ({
        url: '/publish-individual',
        method: 'POST',
        body: {
          facility_id: facilityId,
          ecri_ids: ecriIds,
        },
      }),
      invalidatesTags: ['ExistingCustomers', 'Summary'],
    }),

    // Run Python model
    runPythonModel: builder.mutation({
      query: () => ({
        url: '/run-python',
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
  useRunPythonModelMutation,
} = existingCustomersApi;

export default existingCustomersApi;
