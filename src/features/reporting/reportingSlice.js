import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
  // Filter states for different reporting tabs
  // Store dates as ISO strings to maintain Redux serialization
  executiveSummary: {
    dateRange: [dayjs().subtract(30, 'day').toISOString(), dayjs().toISOString()],
    facilityIds: [],
  },
  streetRates: {
    dateRange: [dayjs().subtract(30, 'day').toISOString(), dayjs().toISOString()],
    facilityIds: [],
  },
  existingRates: {
    dateRange: [dayjs().subtract(3, 'month').toISOString(), dayjs().toISOString()],
    facilityIds: [],
  },

  // UI states
  ui: {
    activeTab: 'executive-summary',
    isFiltersExpanded: true,
  },

  // Loading states for different sections
  loading: {
    executiveSummaryMetrics: false,
    executiveSummaryCharts: false,
    streetRatesData: false,
    existingRatesData: false,
  },

  // Error states
  errors: {
    executiveSummary: null,
    streetRates: null,
    existingRates: null,
  },

  // Cache for formatted data to avoid recalculation
  cache: {
    lastUpdated: null,
    executiveSummaryData: null,
    streetRatesData: null,
    existingRatesData: null,
  },
};

const reportingSlice = createSlice({
  name: 'reporting',
  initialState,
  reducers: {
    // Filter management
    // Convert Day.js objects to ISO strings for serialization
    setExecutiveSummaryFilters: (state, action) => {
      const { dateRange, facilityIds } = action.payload;
      if (dateRange !== undefined) {
        state.executiveSummary.dateRange = dateRange
          ? dateRange.map((date) => (dayjs.isDayjs(date) ? date.toISOString() : date))
          : dateRange;
      }
      if (facilityIds !== undefined) state.executiveSummary.facilityIds = facilityIds;
    },

    setStreetRatesFilters: (state, action) => {
      const { dateRange, facilityIds } = action.payload;
      if (dateRange !== undefined) {
        state.streetRates.dateRange = dateRange
          ? dateRange.map((date) => (dayjs.isDayjs(date) ? date.toISOString() : date))
          : dateRange;
      }
      if (facilityIds !== undefined) state.streetRates.facilityIds = facilityIds;
    },

    setExistingRatesFilters: (state, action) => {
      const { dateRange, facilityIds } = action.payload;
      if (dateRange !== undefined) {
        state.existingRates.dateRange = dateRange
          ? dateRange.map((date) => (dayjs.isDayjs(date) ? date.toISOString() : date))
          : dateRange;
      }
      if (facilityIds !== undefined) state.existingRates.facilityIds = facilityIds;
    },

    // UI state management
    setActiveTab: (state, action) => {
      state.ui.activeTab = action.payload;
    },

    setFiltersExpanded: (state, action) => {
      state.ui.isFiltersExpanded = action.payload;
    },

    // Loading state management
    setExecutiveSummaryMetricsLoading: (state, action) => {
      state.loading.executiveSummaryMetrics = action.payload;
    },

    setExecutiveSummaryChartsLoading: (state, action) => {
      state.loading.executiveSummaryCharts = action.payload;
    },

    setStreetRatesLoading: (state, action) => {
      state.loading.streetRatesData = action.payload;
    },

    setExistingRatesLoading: (state, action) => {
      state.loading.existingRatesData = action.payload;
    },

    // Error state management
    setExecutiveSummaryError: (state, action) => {
      state.errors.executiveSummary = action.payload;
    },

    setStreetRatesError: (state, action) => {
      state.errors.streetRates = action.payload;
    },

    setExistingRatesError: (state, action) => {
      state.errors.existingRates = action.payload;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.errors = {
        executiveSummary: null,
        streetRates: null,
        existingRates: null,
      };
    },

    // Cache management
    setCachedData: (state, action) => {
      const { section, data } = action.payload;
      state.cache[`${section}Data`] = data;
      state.cache.lastUpdated = dayjs().toISOString();
    },

    clearCache: (state, action) => {
      const section = action.payload;
      if (section) {
        state.cache[`${section}Data`] = null;
      } else {
        // Clear all cache
        state.cache = {
          lastUpdated: null,
          executiveSummaryData: null,
          streetRatesData: null,
          existingRatesData: null,
        };
      }
    },

    // Reset specific tab filters to default
    resetExecutiveSummaryFilters: (state) => {
      state.executiveSummary = {
        dateRange: [dayjs().subtract(30, 'day').toISOString(), dayjs().toISOString()],
        facilityIds: [],
      };
    },

    resetStreetRatesFilters: (state) => {
      state.streetRates = {
        dateRange: [dayjs().subtract(30, 'day').toISOString(), dayjs().toISOString()],
        facilityIds: [],
      };
    },

    resetExistingRatesFilters: (state) => {
      state.existingRates = {
        dateRange: [dayjs().subtract(3, 'month').toISOString(), dayjs().toISOString()],
        facilityIds: [],
      };
    },

    // Reset all filters
    resetAllFilters: (state) => {
      state.executiveSummary = {
        dateRange: [dayjs().subtract(30, 'day').toISOString(), dayjs().toISOString()],
        facilityIds: [],
      };
      state.streetRates = {
        dateRange: [dayjs().subtract(30, 'day').toISOString(), dayjs().toISOString()],
        facilityIds: [],
      };
      state.existingRates = {
        dateRange: [dayjs().subtract(3, 'month').toISOString(), dayjs().toISOString()],
        facilityIds: [],
      };
    },
  },
});

export const {
  // Filter actions
  setExecutiveSummaryFilters,
  setStreetRatesFilters,
  setExistingRatesFilters,

  // UI actions
  setActiveTab,
  setFiltersExpanded,

  // Loading actions
  setExecutiveSummaryMetricsLoading,
  setExecutiveSummaryChartsLoading,
  setStreetRatesLoading,
  setExistingRatesLoading,

  // Error actions
  setExecutiveSummaryError,
  setStreetRatesError,
  setExistingRatesError,
  clearErrors,

  // Cache actions
  setCachedData,
  clearCache,

  // Reset actions
  resetExecutiveSummaryFilters,
  resetStreetRatesFilters,
  resetExistingRatesFilters,
  resetAllFilters,
} = reportingSlice.actions;

export default reportingSlice.reducer;
