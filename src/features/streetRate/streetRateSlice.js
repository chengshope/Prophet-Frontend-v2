/**
 * Redux slice for StreetRates page state management
 * Following Rule #2: All state management via RTK
 * Following Rule #28: Do not change layout or logic
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Page filters and search
  filters: {
    search: '',
    sort: 'facility_name',
    orderby: 'asc',
  },

  // Pagination state
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },

  // UI state
  ui: {
    publishModalOpen: false,
    errorModalOpen: false,
    errorLog: '',
    latestPublishedDate: '',
  },

  // Loading states
  loading: {
    facilities: false,
    publishing: false,
    refreshing: false,
    exporting: false,
  },

  // Error states
  errors: {
    facilities: null,
    publishing: null,
    refreshing: null,
    exporting: null,
  },
};

const streetRateSlice = createSlice({
  name: 'streetRate',
  initialState,
  reducers: {
    // Filter management
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when searching
    },

    setSort: (state, action) => {
      const { column, direction } = action.payload;
      state.filters.sort = column;
      state.filters.orderby = direction;
    },

    resetFilters: (state) => {
      state.filters = {
        search: '',
        sort: 'facility_name',
        orderby: 'asc',
      };
      state.pagination.currentPage = 1;
    },

    // Pagination management
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1; // Reset to first page when changing page size
    },

    // UI state management
    setPublishModalOpen: (state, action) => {
      state.ui.publishModalOpen = action.payload;
    },

    setErrorModalOpen: (state, action) => {
      state.ui.errorModalOpen = action.payload;
    },

    setErrorLog: (state, action) => {
      state.ui.errorLog = action.payload;
    },

    setLatestPublishedDate: (state, action) => {
      state.ui.latestPublishedDate = action.payload;
    },

    closeErrorModal: (state) => {
      state.ui.errorModalOpen = false;
      state.ui.errorLog = '';
    },

    // Loading state management
    setFacilitiesLoading: (state, action) => {
      state.loading.facilities = action.payload;
    },

    setPublishingLoading: (state, action) => {
      state.loading.publishing = action.payload;
    },

    setRefreshingLoading: (state, action) => {
      state.loading.refreshing = action.payload;
    },

    setExportingLoading: (state, action) => {
      state.loading.exporting = action.payload;
    },

    // Error state management
    setFacilitiesError: (state, action) => {
      state.errors.facilities = action.payload;
    },

    setPublishingError: (state, action) => {
      state.errors.publishing = action.payload;
    },

    setRefreshingError: (state, action) => {
      state.errors.refreshing = action.payload;
    },

    setExportingError: (state, action) => {
      state.errors.exporting = action.payload;
    },

    clearErrors: (state) => {
      state.errors = {
        facilities: null,
        publishing: null,
        refreshing: null,
        exporting: null,
      };
    },

    // Reset all state
    resetPageState: () => {
      return initialState;
    },
  },
});

export const {
  // Filter actions
  setSearch,
  setSort,
  resetFilters,

  // Pagination actions
  setCurrentPage,
  setPageSize,

  // UI actions
  setPublishModalOpen,
  setErrorModalOpen,
  setErrorLog,
  setLatestPublishedDate,
  closeErrorModal,

  // Loading actions
  setFacilitiesLoading,
  setPublishingLoading,
  setRefreshingLoading,
  setExportingLoading,

  // Error actions
  setFacilitiesError,
  setPublishingError,
  setRefreshingError,
  setExportingError,
  clearErrors,

  // Reset actions
  resetPageState,
} = streetRateSlice.actions;

export default streetRateSlice.reducer;
