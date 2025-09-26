import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const competitorsApi = createApi({
  reducerPath: 'competitorsApi',
  baseQuery,
  tagTypes: ['Competitors', 'Facilities', 'Strategies'],
  endpoints: (builder) => ({
    getCompetitors: builder.query({
      query: ({ storeTrackId, search = '' }) => ({
        url: `competitor/${storeTrackId}`,
        params: { search },
      }),
      providesTags: (result, error, { storeTrackId }) => [
        { type: 'Competitors', id: storeTrackId },
        'Competitors',
      ],
    }),

    updateCompetitor: builder.mutation({
      query: ({ competitorId, ...updateData }) => ({
        url: `/competitor/${competitorId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { competitorId }) => [
        { type: 'Competitors', id: competitorId },
        'Competitors',
      ],
    }),

    updateCompetitorsByStoreId: builder.mutation({
      query: ({ storeId, competitors }) => ({
        url: `/comp_stores/${storeId}`,
        method: 'POST',
        body: { competitors },
      }),
      invalidatesTags: ['Competitors'],
    }),

    getFacilities: builder.query({
      query: () => '/street_rates',
      providesTags: ['Facilities'],
    }),

    updateFacility: builder.mutation({
      query: ({ facilityId, ...updateData }) => ({
        url: `/facility_profile/facility/${facilityId}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: (result, error, { facilityId }) => [
        { type: 'Facilities', id: facilityId },
        'Facilities',
      ],
    }),

    getStrategies: builder.query({
      query: (customerId) => `/facility_profile/${customerId}/strategies`,
      providesTags: ['Strategies'],
    }),

    saveFacilityStrategy: builder.mutation({
      query: ({ facilityId, strategyValue }) => ({
        url: `/facility_profile/facility/${facilityId}/save_strategies`,
        method: 'POST',
        body: { strategyValue },
      }),
      invalidatesTags: ['Strategies', 'Facilities'],
    }),

    savePortfolioStrategies: builder.mutation({
      query: ({ customerId, strategyValue }) => ({
        url: `/facility_profile/${customerId}/save_strategies`,
        method: 'POST',
        body: { strategyValue },
      }),
      invalidatesTags: ['Strategies', 'Facilities'],
    }),
  }),
});

export const {
  useGetCompetitorsQuery,
  useUpdateCompetitorMutation,
  useUpdateCompetitorsByStoreIdMutation,
  useGetFacilitiesQuery,
  useUpdateFacilityMutation,
  useGetStrategiesQuery,
  useSaveFacilityStrategyMutation,
  useSavePortfolioStrategiesMutation,
} = competitorsApi;
