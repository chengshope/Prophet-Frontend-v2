import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const competitorsApi = createApi({
  reducerPath: 'competitorsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Competitors', 'Facilities'],
  endpoints: (builder) => ({
    // Get competitors for a facility
    getCompetitors: builder.query({
      query: ({ facilityId, search = '' }) => ({
        url: `/competitor/${facilityId}`,
        params: search ? { search } : {},
      }),
      providesTags: ['Competitors'],
    }),

    // Update competitor
    updateCompetitor: builder.mutation({
      query: ({ competitorId, ...updateData }) => ({
        url: `/competitor/${competitorId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Competitors'],
    }),

    // Update competitors by store ID
    updateCompetitorsByStoreId: builder.mutation({
      query: ({ storeId, competitors }) => ({
        url: `/comp_stores/${storeId}`,
        method: 'POST',
        body: { competitors },
      }),
      invalidatesTags: ['Competitors'],
    }),

    // Get facilities for facility selection
    getFacilities: builder.query({
      query: () => '/facility_profile',
      providesTags: ['Facilities'],
    }),

    // Update facility
    updateFacility: builder.mutation({
      query: ({ facilityId, ...updateData }) => ({
        url: `/facility_profile/facility/${facilityId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Facilities'],
    }),
  }),
});

export const {
  useGetCompetitorsQuery,
  useUpdateCompetitorMutation,
  useUpdateCompetitorsByStoreIdMutation,
  useGetFacilitiesQuery,
  useUpdateFacilityMutation,
} = competitorsApi;

export default competitorsApi;
