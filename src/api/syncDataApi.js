import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const syncDataApi = createApi({
  reducerPath: 'syncDataApi',
  baseQuery,
  tagTypes: ['SyncData'],
  endpoints: (builder) => ({
    // Sync data - main sync endpoint
    syncData: builder.mutation({
      query: () => ({
        url: '/sync-data',
        method: 'GET',
      }),
      invalidatesTags: ['SyncData'],
    }),

    // Sync data UI - for specific portfolio
    syncDataUI: builder.mutation({
      query: (portfolioId) => ({
        url: `/sync-data-ui/${portfolioId}`,
        method: 'GET',
      }),
      invalidatesTags: ['SyncData'],
    }),

    // Run Python model for street rates
    runStreetRatesPython: builder.mutation({
      query: () => ({
        url: '/street_rates/run-python',
        method: 'POST',
      }),
      invalidatesTags: ['SyncData'],
    }),

    // Run Python model for ECRI
    runECRIPython: builder.mutation({
      query: () => ({
        url: '/ecri/run-python',
        method: 'POST',
      }),
      invalidatesTags: ['SyncData'],
    }),
  }),
});

export const {
  useSyncDataMutation,
  useSyncDataUIMutation,
  useRunStreetRatesPythonMutation,
  useRunECRIPythonMutation,
} = syncDataApi;
