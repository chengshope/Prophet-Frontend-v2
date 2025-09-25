import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery,
  tagTypes: [
    'PortfolioSettings',
    'FacilitySettings',
    'EcriSettings',
    'ValuePricing',
    'UnitRanking',
    'CronJobSettings',
    'PortfolioStrategies',
    'PortfolioValuePricing',
  ],
  endpoints: (builder) => ({
    // Portfolio Settings
    getPortfolioSettings: builder.query({
      query: (portfolioId) => `/portfolio/${portfolioId}`,
      providesTags: (result, error, portfolioId) => [
        { type: 'PortfolioSettings', id: portfolioId },
      ],
      transformResponse: (response) => response.result || response,
    }),

    updatePortfolioSettings: builder.mutation({
      query: ({ portfolioId, ...data }) => ({
        url: `/portfolio/${portfolioId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { portfolioId }) => [
        { type: 'PortfolioSettings', id: portfolioId },
      ],
    }),

    // Facility Settings
    getFacilitySettings: builder.query({
      query: (facilityId) => `/street_rates/${facilityId}`,
      providesTags: (result, error, facilityId) => [{ type: 'FacilitySettings', id: facilityId }],
      transformResponse: (response) => response.result || response,
    }),

    updateFacilitySettings: builder.mutation({
      query: ({ facilityId, ...data }) => ({
        url: `/facility_profile/update-facility/${facilityId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { facilityId }) => [
        { type: 'FacilitySettings', id: facilityId },
      ],
    }),

    // ECRI Settings - Portfolio
    getPortfolioEcriSettings: builder.query({
      query: (portfolioId) => `/portfolio/${portfolioId}`,
      providesTags: (result, error, portfolioId) => [
        { type: 'EcriSettings', id: `portfolio-${portfolioId}` },
      ],
      transformResponse: (response) => {
        const data = response.result || response;
        return data.ecri_settings || {};
      },
    }),

    updatePortfolioEcriSettings: builder.mutation({
      query: ({ portfolioId, ecri_settings }) => ({
        url: `/portfolio/ecri/${portfolioId}`,
        method: 'PUT',
        body: { ecri_settings },
      }),
      // invalidatesTags: (result, error, { portfolioId }) => [
      //   { type: 'EcriSettings', id: `portfolio-${portfolioId}` },
      //   { type: 'PortfolioSettings', id: portfolioId },
      // ],
    }),

    // ECRI Settings - Facility
    getFacilityEcriSettings: builder.query({
      query: (facilityId) => `/facility_profile/facility/${facilityId}/ecri`,
      providesTags: (result, error, facilityId) => [
        { type: 'EcriSettings', id: `facility-${facilityId}` },
      ],
      transformResponse: (response) => {
        const data = response.result || response;
        return data.ecri_settings || {};
      },
    }),

    updateFacilityEcriSettings: builder.mutation({
      query: ({ facilityId, ecri_settings }) => ({
        url: `/facility_profile/facility/${facilityId}/ecri`,
        method: 'PUT',
        body: { ecri_settings },
      }),
      invalidatesTags: (result, error, { facilityId }) => [
        { type: 'EcriSettings', id: `facility-${facilityId}` },
        { type: 'FacilitySettings', id: facilityId },
      ],
    }),

    // Value Pricing - Portfolio
    getPortfolioValuePricing: builder.query({
      query: (customerId) => `/facility_profile/${customerId}/value_pricing`,
      providesTags: (result, error, customerId) => [
        { type: 'ValuePricing', id: `portfolio-${customerId}` },
      ],
      transformResponse: (response) => response.result || response,
    }),

    updatePortfolioValuePricing: builder.mutation({
      query: ({ customerId, value_pricing }) => ({
        url: `/facility_profile/save-portfolio-value-pricing/${customerId}`,
        method: 'PUT',
        body: { value_pricing },
      }),
      invalidatesTags: (result, error, { customerId }) => [
        { type: 'ValuePricing', id: `portfolio-${customerId}` },
      ],
    }),

    // Value Pricing - Facility
    updateFacilityValuePricing: builder.mutation({
      query: ({ facilityId, value_pricing }) => ({
        url: `/facility_profile/update-facility/${facilityId}`,
        method: 'PUT',
        body: { value_pricing },
      }),
      invalidatesTags: (result, error, { facilityId }) => [
        { type: 'ValuePricing', id: `facility-${facilityId}` },
        { type: 'FacilitySettings', id: facilityId },
      ],
    }),

    // Unit Ranking Upload/Download
    uploadUnitRanking: builder.mutation({
      query: ({ facilityId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('facility_id', facilityId);
        return {
          url: '/unit/upload-xlsx',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { facilityId }) => [{ type: 'UnitRanking', id: facilityId }],
    }),

    downloadSampleXLSX: builder.query({
      query: (facilityId) => ({
        url: `/unit/sample-xlsx?type=excelFormat&facility_id=${facilityId}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    exportUnitRanking: builder.query({
      query: (facilityId) => ({
        url: `/unit/export-xlsx?type=excelFormat&facility_id=${facilityId}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Get facilities list for dropdown
    getFacilitiesList: builder.query({
      query: () => '/street_rates/list',
      providesTags: ['FacilitySettings'],
      transformResponse: (response) => response.result || response,
    }),

    // Portfolio management endpoints
    getPortfolioById: builder.query({
      query: (portfolioId) => `/portfolio/${portfolioId}/details`,
      transformResponse: (response) => response.result || response,
      providesTags: ['PortfolioSettings'],
    }),

    // Get portfolio details by ID (matching v1: /portfolio/id/:id)
    getPortfolioDetailsById: builder.query({
      query: (portfolioId) => `/portfolio/id/${portfolioId}`,
      transformResponse: (response) => response.result || response,
      providesTags: (result, error, portfolioId) => [
        { type: 'PortfolioSettings', id: portfolioId },
      ],
    }),

    getPortfolioUsers: builder.query({
      query: (portfolioId) => `/portfolio/${portfolioId}/users`,
      transformResponse: (response) => response.result || response,
      providesTags: ['PortfolioUsers'],
    }),

    createPortfolioUser: builder.mutation({
      query: ({ portfolioId, userData }) => ({
        url: `/portfolio/${portfolioId}/users`,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['PortfolioUsers'],
    }),

    deletePortfolioUser: builder.mutation({
      query: ({ portfolioId, userId }) => ({
        url: `/portfolio/${portfolioId}/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PortfolioUsers'],
    }),

    getPortfolioCompanies: builder.query({
      query: () => '/portfolio/storEdge/companies',
      transformResponse: (response) => response.result || response,
    }),

    // Get all portfolios for dropdown selection
    getPortfoliosList: builder.query({
      query: () => '/portfolio/list',
      transformResponse: (response) => response.result || response,
      providesTags: ['PortfolioSettings'],
    }),

    // Create portfolio with users (matching v1: POST /portfolio/add)
    createPortfolioAndUsers: builder.mutation({
      query: (portfolioData) => ({
        url: '/portfolio/add',
        method: 'POST',
        body: portfolioData,
      }),
      invalidatesTags: ['PortfolioSettings'],
    }),

    // Get facilities by portfolio ID (matching v1: GET /portfolio/{portfolioId}/facility/list)
    getPortfolioFacilities: builder.query({
      query: (portfolioId) => `/portfolio/${portfolioId}/facility/list`,
      transformResponse: (response) => response.result || response,
      providesTags: (result, error, portfolioId) => [
        { type: 'PortfolioFacilities', id: portfolioId },
      ],
    }),

    // Get users by portfolio ID (matching v1: GET /customers/users?portfolio_id={portfolioId}&role_id=1)
    getPortfolioCustomerUsers: builder.query({
      query: (portfolioId) => `/customers/users?portfolio_id=${portfolioId}&role_id=1`,
      transformResponse: (response) => response.result || response,
      providesTags: (result, error, portfolioId) => [
        { type: 'PortfolioCustomerUsers', id: portfolioId },
      ],
    }),

    syncPortfolioFacilities: builder.mutation({
      query: (portfolioId) => ({
        url: `/sync-data-ui/${portfolioId}`,
        method: 'GET',
      }),
      invalidatesTags: ['FacilitySettings'],
    }),

    // StorTrack lookup (matching v1: POST /portfolio/lookupStorTrack)
    lookupStorTrack: builder.mutation({
      query: (payload) => ({
        url: '/portfolio/lookupStorTrack',
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response) => response.result || response,
    }),

    // Create user (matching v1: POST /customers/users)
    createPortfolioUser: builder.mutation({
      query: (userData) => ({
        url: '/customers/users',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response) => response.result || response,
      invalidatesTags: (result, error, userData) => [
        { type: 'PortfolioCustomerUsers', id: userData.portfolio_id },
      ],
    }),

    // Delete user (matching v1: DELETE /customers/users/{id})
    deletePortfolioUser: builder.mutation({
      query: (userId) => ({
        url: `/customers/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PortfolioCustomerUsers'],
    }),

    // Update competitor store (matching v1: POST /comp_stores/{storeid})
    updateCompetitorStore: builder.mutation({
      query: ({ storeid, storeData }) => ({
        url: `/comp_stores/${storeid}`,
        method: 'POST',
        body: storeData,
      }),
      transformResponse: (response) => response.result || response,
    }),

    // Update facility StorTrack settings (matching v1: PUT /facility_profile/update-facility/{facilityId})
    updateFacilityStorTrack: builder.mutation({
      query: ({ facilityId, stortrack_id, stortrack_radius }) => ({
        url: `/facility_profile/update-facility/${facilityId}`,
        method: 'PUT',
        body: {
          stortrack_id,
          stortrack_radius,
        },
      }),
      invalidatesTags: (_, __, { facilityId, portfolioId }) => [
        { type: 'FacilitySettings', id: facilityId },
        { type: 'PortfolioFacilities', id: portfolioId },
        'PortfolioFacilities',
      ],
    }),

    toggleFacilityProfile: builder.mutation({
      query: (facilityId) => ({
        url: `/facility_profile/toggle-profile/${facilityId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, facilityId) => [
        { type: 'FacilitySettings', id: facilityId },
      ],
    }),

    // Toggle facility status (matching v1: PUT /facility_profile/toggle-status/{id})
    toggleFacilityStatus: builder.mutation({
      query: (facilityId) => ({
        url: `/facility_profile/toggle-status/${facilityId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, facilityId) => [
        { type: 'FacilitySettings', id: facilityId },
      ],
    }),

    // Cron Job Settings
    getCronJobSettings: builder.query({
      query: (customerId) => `/cron-job/${customerId}`,
      transformResponse: (response) => response.result || response,
      providesTags: ['CronJobSettings'],
    }),

    updateCronJobSettings: builder.mutation({
      query: (data) => ({
        url: '/cron-job',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['CronJobSettings'],
    }),

    // Portfolio Strategies
    getPortfolioStrategies: builder.query({
      query: (customerId) => `/facility_profile/${customerId}/strategies`,
      transformResponse: (response) => response.result || response,
      providesTags: ['PortfolioStrategies'],
    }),

    savePortfolioStrategies: builder.mutation({
      query: ({ customerId, strategyValue }) => ({
        url: `/facility_profile/${customerId}/save_strategies`,
        method: 'POST',
        body: { strategyValue },
      }),
      invalidatesTags: ['PortfolioStrategies'],
    }),

    saveFacilityStrategies: builder.mutation({
      query: ({ facilityId, strategyValue }) => ({
        url: `/facility_profile/facility/${facilityId}/save_strategies`,
        method: 'POST',
        body: { strategyValue },
      }),
      invalidatesTags: ['PortfolioStrategies'],
    }),

    // Portfolio Value Pricing
    getPortfolioValuePricing: builder.query({
      query: (customerId) => `/facility_profile/${customerId}/value_pricing`,
      transformResponse: (response) => response.result || response,
      providesTags: ['PortfolioValuePricing'],
    }),

    savePortfolioValuePricing: builder.mutation({
      query: ({ customerId, valuePricing }) => ({
        url: `/facility_profile/${customerId}/save_value_pricing`,
        method: 'POST',
        body: { value_pricing: valuePricing },
      }),
      invalidatesTags: ['PortfolioValuePricing'],
    }),

    saveFacilityValuePricing: builder.mutation({
      query: ({ facilityId, valuePricing }) => ({
        url: `/facility_profile/update-facility/${facilityId}`,
        method: 'PUT',
        body: { value_pricing: valuePricing },
      }),
      invalidatesTags: ['PortfolioValuePricing'],
    }),
  }),
});

export const {
  // Portfolio Settings
  useGetPortfolioSettingsQuery,
  useUpdatePortfolioSettingsMutation,

  // Facility Settings
  useGetFacilitySettingsQuery,
  useUpdateFacilitySettingsMutation,

  // ECRI Settings
  useGetPortfolioEcriSettingsQuery,
  useUpdatePortfolioEcriSettingsMutation,
  useGetFacilityEcriSettingsQuery,
  useUpdateFacilityEcriSettingsMutation,

  // Value Pricing (Legacy - keeping for backward compatibility)
  useUpdatePortfolioValuePricingMutation,
  useUpdateFacilityValuePricingMutation,

  // Strategies (Legacy - keeping for backward compatibility)
  useUpdatePortfolioStrategiesMutation,
  useUpdateFacilityStrategiesMutation,

  // Unit Ranking
  useUploadUnitRankingMutation,
  useLazyDownloadSampleXLSXQuery,
  useLazyExportUnitRankingQuery,

  // Facilities List
  useGetFacilitiesListQuery,

  // Portfolio Management
  useGetPortfolioByIdQuery,
  useGetPortfolioDetailsByIdQuery,
  useGetPortfolioUsersQuery,
  useCreatePortfolioUserMutation,
  useDeletePortfolioUserMutation,
  useGetPortfolioCompaniesQuery,
  useGetPortfoliosListQuery,
  useCreatePortfolioAndUsersMutation,
  useGetPortfolioFacilitiesQuery,
  useGetPortfolioCustomerUsersQuery,
  useSyncPortfolioFacilitiesMutation,
  useLookupStorTrackMutation,
  useUpdateFacilityStorTrackMutation,
  useUpdateCompetitorStoreMutation,
  useToggleFacilityProfileMutation,
  useToggleFacilityStatusMutation,

  // Cron Job Settings
  useGetCronJobSettingsQuery,
  useUpdateCronJobSettingsMutation,

  // Portfolio Strategies
  useGetPortfolioStrategiesQuery,
  useSavePortfolioStrategiesMutation,
  useSaveFacilityStrategiesMutation,

  // Portfolio Value Pricing
  useGetPortfolioValuePricingQuery,
  useSavePortfolioValuePricingMutation,
  useSaveFacilityValuePricingMutation,
} = settingsApi;
