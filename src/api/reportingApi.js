import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const reportingApi = createApi({
  reducerPath: 'reportingApi',
  baseQuery,
  tagTypes: ['ReportingData'],
  endpoints: (builder) => ({
    // Executive Summary endpoints
    getGrossRentalRevenue: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/gross-rental-revenue?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    getGrossPotentialRevenue: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/gross-potential-revenue?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    getOccupancy: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/occupancy?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    getRevPAF: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/revpaf?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    // Chart data endpoints
    getGrossRentalRevenueOverTime: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/gross-rental-revenue-over-time?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    getGrossPotentialRevenueOverTime: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/gross-potential-revenue-over-time?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    getRevPAFOverTime: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/revpaf-over-time?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    getOccupancyOverTime: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/occupancy-over-time?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    // Street Rates endpoints
    getStreetRatesReport: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/street-rates?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),

    // Existing Customers endpoints
    getExistingCustomersReport: builder.query({
      query: ({ startDate, endDate, facilityIds } = {}) => {
        const params = new URLSearchParams();
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (facilityIds?.length) {
          // Convert array to comma-separated string like v1
          params.append('facility_ids', facilityIds.join(','));
        }
        return `/reporting/existing-customers?${params.toString()}`;
      },
      providesTags: ['ReportingData'],
    }),
  }),
});

export const {
  useGetGrossRentalRevenueQuery,
  useGetGrossPotentialRevenueQuery,
  useGetOccupancyQuery,
  useGetRevPAFQuery,
  useGetGrossRentalRevenueOverTimeQuery,
  useGetGrossPotentialRevenueOverTimeQuery,
  useGetRevPAFOverTimeQuery,
  useGetOccupancyOverTimeQuery,
  useGetStreetRatesReportQuery,
  useGetExistingCustomersReportQuery,
} = reportingApi;
