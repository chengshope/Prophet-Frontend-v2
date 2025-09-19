/**
 * Competitors API
 * Following Rule #2: All API calls must be made via Redux Toolkit (RTK)
 * Matching v1 API endpoints and response structure exactly
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

const competitorsApi = createApi({
  reducerPath: 'competitorsApi',
  baseQuery,
  tagTypes: ['Competitors', 'Facilities', 'Strategies'],
  endpoints: (builder) => ({
    // Get competitors for a facility (matching v1: /api/competitor/:storeTrackId)
    getCompetitors: builder.query({
      query: ({ storeTrackId, search = '' }) => ({
        url: `competitor/${storeTrackId}`,
        params: { search },
      }),
      providesTags: (result, error, { storeTrackId }) => [
        { type: 'Competitors', id: storeTrackId },
        'Competitors',
      ],
      // Transform response to match v1 structure
      transformResponse: (response) => {
        // v1 returns { result: [...] }
        return response.result || response;
      },
    }),

    // Update competitor (matching v1: PUT /api/competitor/:id)
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

    // Update competitors by store ID (matching v1: POST /api/comp_stores/:storeId)
    updateCompetitorsByStoreId: builder.mutation({
      query: ({ storeId, competitors }) => ({
        url: `/comp_stores/${storeId}`,
        method: 'POST',
        body: { competitors },
      }),
      invalidatesTags: ['Competitors'],
    }),

    // Get facilities for facility selection (matching v1: GET /api/street_rates)
    getFacilities: builder.query({
      query: () => '/street_rates',
      providesTags: ['Facilities'],
      // Transform response to match v1 structure
      transformResponse: (response) => {
        // v1 returns { result: [...] }
        return response.result || response;
      },
    }),

    // Update facility (matching v1: PUT /api/facility_profile/facility/:facilityId)
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

    // Get strategies for customer (matching backend: GET /api/facility_profile/:customer_id/strategies)
    getStrategies: builder.query({
      query: (customerId) => `/facility_profile/${customerId}/strategies`,
      providesTags: ['Strategies'],
    }),

    // Save facility strategy (matching backend: POST /api/facility_profile/facility/:facility_id/save_strategies)
    saveFacilityStrategy: builder.mutation({
      query: ({ facilityId, strategyValue }) => ({
        url: `/facility_profile/facility/${facilityId}/save_strategies`,
        method: 'POST',
        body: { strategyValue },
      }),
      invalidatesTags: ['Strategies', 'Facilities'],
    }),

    // Save portfolio strategies (matching backend: POST /api/facility_profile/:customer_id/save_strategies)
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

export default competitorsApi;
