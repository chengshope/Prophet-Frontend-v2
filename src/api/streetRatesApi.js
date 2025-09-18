import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const streetRatesApi = createApi({
  reducerPath: 'streetRatesApi',
  baseQuery,
  tagTypes: ['StreetRates', 'UnitTypes', 'FacilityRates'],
  endpoints: (builder) => ({
    getStreetRatesFacilities: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append('page', params.page);
        if (params.limit) searchParams.append('limit', params.limit);
        if (params.search) searchParams.append('search', params.search);
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.orderby) searchParams.append('orderby', params.orderby);
        if (params.status) searchParams.append('status', params.status);

        return `street_rates?${searchParams.toString()}`;
      },
      providesTags: ['StreetRates'],
    }),

    // Get simple list of facilities (for dropdowns)
    getStreetRatesFacilitiesList: builder.query({
      query: () => 'street_rates/list',
      providesTags: ['StreetRates'],
    }),

    // Get specific facility details
    getFacilityById: builder.query({
      query: (id) => `street_rates/${id}`,
      providesTags: (result, error, id) => [{ type: 'FacilityRates', id }],
    }),

    // Get unit types for a facility
    getUnitTypes: builder.query({
      query: (facilityId) => ({
        url: 'street_rates/unit-types',
        params: { facility_id: facilityId },
      }),
      providesTags: (result, error, facilityId) => [{ type: 'UnitTypes', id: facilityId }],
    }),

    // Save rate changes (without publishing)
    saveRateChanges: builder.mutation({
      query: ({ facilityId, units }) => ({
        url: 'street_rates/save',
        method: 'POST',
        body: {
          facility_id: facilityId,
          units,
        },
      }),
      invalidatesTags: ['StreetRates', 'FacilityRates'],
    }),

    // Submit/publish rates for all facilities
    submitAllRates: builder.mutation({
      query: (changedUnitStatistics) => ({
        url: 'street_rates/submit',
        method: 'POST',
        body: {
          changed_unit_statistics: changedUnitStatistics,
        },
      }),
    }),

    // Submit/publish rates for individual facility
    submitIndividualRates: builder.mutation({
      query: ({ facilityId, changedUnitStatistics }) => ({
        url: 'street_rates/submit-individual',
        method: 'POST',
        body: {
          facility_id: facilityId,
          changed_unit_statistics: changedUnitStatistics,
        },
      }),
    }),

    // Run Python ML model to refresh rates
    runPythonModel: builder.mutation({
      query: () => ({
        url: 'street_rates/run-python',
        method: 'POST',
      }),
    }),

    // Update unit type settings
    updateUnitType: builder.mutation({
      query: ({ id, facilityId, ...data }) => ({
        url: `street_rates/unit-type/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Update unit type statistics
    updateUnitTypeStats: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `street_rates/unit-type-stats/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Export CSV
    exportCSV: builder.query({
      query: () => ({
        url: 'street_rates/export-csv',
        responseHandler: (response) => response.text(), // Handle CSV response as text
      }),
    }),
  }),
});

export const {
  useGetStreetRatesFacilitiesQuery,
  useGetStreetRatesFacilitiesListQuery,
  useGetFacilityByIdQuery,
  useGetUnitTypesQuery,
  useSaveRateChangesMutation,
  useSubmitAllRatesMutation,
  useSubmitIndividualRatesMutation,
  useRunPythonModelMutation,
  useUpdateUnitTypeMutation,
  useUpdateUnitTypeStatsMutation,
  useLazyExportCSVQuery,
} = streetRatesApi;
