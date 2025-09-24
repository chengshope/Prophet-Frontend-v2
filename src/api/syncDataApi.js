import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const syncDataApi = createApi({
  reducerPath: 'syncDataApi',
  baseQuery,
  tagTypes: ['SyncData'],
  endpoints: (builder) => ({
    syncData: builder.mutation({
      query: () => ({
        url: '/sync-data',
        method: 'GET',
      }),
      invalidatesTags: ['SyncData'],
    }),

    runStreetRatesPython: builder.mutation({
      query: () => ({
        url: '/street_rates/run-python',
        method: 'POST',
      }),
      invalidatesTags: ['SyncData'],
    }),

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
  useRunStreetRatesPythonMutation,
  useRunECRIPythonMutation,
} = syncDataApi;
