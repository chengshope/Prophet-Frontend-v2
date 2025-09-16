// src/api/reportingApi.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

const buildReportingUrl = (path, { startDate, endDate, facilityIds } = {}) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  if (facilityIds?.length) params.append('facility_ids', facilityIds.join(','));
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

const reportingEndpoint = (builder, path, tag) =>
  builder.query({
    query: (args) => buildReportingUrl(path, args),
    providesTags: [tag],
  });

export const reportingApi = createApi({
  reducerPath: 'reportingApi',
  baseQuery,
  tagTypes: [
    'GrossRentalRevenue',
    'GrossPotentialRevenue',
    'Occupancy',
    'RevPAF',
    'GrossRentalRevenueOverTime',
    'GrossPotentialRevenueOverTime',
    'RevPAFOverTime',
    'OccupancyOverTime',
    'StreetRatesReport',
    'UnitTypeAnalysis',
    'OccupancyByFacilities',
    'ExistingCustomersReport',
  ],
  endpoints: (builder) => ({
    getGrossRentalRevenue: reportingEndpoint(
      builder,
      '/reporting/gross-rental-revenue',
      'GrossRentalRevenue'
    ),
    getGrossPotentialRevenue: reportingEndpoint(
      builder,
      '/reporting/gross-potential-revenue',
      'GrossPotentialRevenue'
    ),
    getOccupancy: reportingEndpoint(builder, '/reporting/occupancy', 'Occupancy'),
    getRevPAF: reportingEndpoint(builder, '/reporting/revpaf', 'RevPAF'),

    getGrossRentalRevenueOverTime: reportingEndpoint(
      builder,
      '/reporting/gross-rental-revenue-over-time',
      'GrossRentalRevenueOverTime'
    ),
    getGrossPotentialRevenueOverTime: reportingEndpoint(
      builder,
      '/reporting/gross-potential-revenue-over-time',
      'GrossPotentialRevenueOverTime'
    ),
    getRevPAFOverTime: reportingEndpoint(builder, '/reporting/revpaf-over-time', 'RevPAFOverTime'),
    getOccupancyOverTime: reportingEndpoint(
      builder,
      '/reporting/occupancy-over-time',
      'OccupancyOverTime'
    ),

    getStreetRatesReport: reportingEndpoint(
      builder,
      '/reporting/street-rates',
      'StreetRatesReport'
    ),
    getUnitTypeAnalysis: reportingEndpoint(
      builder,
      '/reporting/unit-type-analysis',
      'UnitTypeAnalysis'
    ),
    getOccupancyByFacilities: reportingEndpoint(
      builder,
      '/reporting/occupancy-by-facilities',
      'OccupancyByFacilities'
    ),
    getExistingCustomersReport: reportingEndpoint(
      builder,
      '/reporting/existing-customers',
      'ExistingCustomersReport'
    ),
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
  useGetUnitTypeAnalysisQuery,
  useGetOccupancyByFacilitiesQuery,
  useGetExistingCustomersReportQuery,
} = reportingApi;
