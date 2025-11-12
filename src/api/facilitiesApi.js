import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const facilitiesApi = createApi({
  reducerPath: 'facilitiesApi',
  baseQuery,
  tagTypes: ['Facility'],
  endpoints: (builder) => ({
    getFacilitiesList: builder.query({
      query: (args) => {
        const status = args?.status;
        return status ? `/street_rates/list?status=${status}` : '/street_rates/list';
      },
      providesTags: ['Facility'],
    }),
  }),
});

export const { useGetFacilitiesListQuery } = facilitiesApi;
