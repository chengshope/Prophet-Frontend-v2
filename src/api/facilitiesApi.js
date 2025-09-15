import { selectPortfolioId } from '@/features/auth/authSelector';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const facilitiesApi = createApi({
  reducerPath: 'facilitiesApi',
  baseQuery,
  tagTypes: ['Facility'],
  endpoints: (builder) => ({
    getFacilities: builder.query({
      queryFn: (arg, api) => {
        try {
          const state = api.getState();
          const portfolioId = selectPortfolioId(state);
          const params = new URLSearchParams();
          if (portfolioId) params.append('portfolio_id', portfolioId);
          return `/street_rates?${params.toString()}`;
        } catch (error) {
          console.warn('Error getting portfolio ID for facilities API:', error);
          return '/street_rates';
        }
      },
      providesTags: ['Facility'],
    }),

    // Get facility by ID (using v1 endpoint)
    getFacilityById: builder.query({
      query: (id, api) => {
        try {
          const state = api.getState();
          const portfolioId = selectPortfolioId(state);
          const params = new URLSearchParams();
          if (portfolioId) params.append('portfolio_id', portfolioId);
          return `/street_rates/${id}?${params.toString()}`;
        } catch (error) {
          console.warn('Error getting portfolio ID for facility by ID API:', error);
          return `/street_rates/${id}`;
        }
      },
      providesTags: (_, __, id) => [{ type: 'Facility', id }],
    }),

    // Get facilities list (alternative endpoint from v1)
    getFacilitiesList: builder.query({
      query: (_, api) => {
        try {
          const state = api.getState();
          const portfolioId = selectPortfolioId(state);
          const params = new URLSearchParams();
          if (portfolioId) params.append('portfolio_id', portfolioId);
          return `/street_rates/list?${params.toString()}`;
        } catch (error) {
          console.warn('Error getting portfolio ID for facilities list API:', error);
          return '/street_rates/list';
        }
      },
      providesTags: ['Facility'],
    }),
  }),
});

export const { useGetFacilitiesQuery, useGetFacilityByIdQuery, useGetFacilitiesListQuery } =
  facilitiesApi;
