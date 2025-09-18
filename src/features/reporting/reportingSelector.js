import { createSelector } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

// Base selectors
const selectReportingState = (state) => state.reporting;

// Helper function to convert ISO strings back to Day.js objects
const convertDateRangeToMoment = (filters) => ({
  ...filters,
  dateRange: filters.dateRange
    ? filters.dateRange.map((date) => (typeof date === 'string' ? dayjs(date) : date))
    : filters.dateRange,
});

// Filter selectors - convert ISO strings back to Day.js objects
export const selectExecutiveSummaryFilters = createSelector([selectReportingState], (reporting) =>
  convertDateRangeToMoment(reporting.executiveSummary)
);

export const selectStreetRatesFilters = createSelector([selectReportingState], (reporting) =>
  convertDateRangeToMoment(reporting.streetRates)
);

export const selectExistingRatesFilters = createSelector([selectReportingState], (reporting) =>
  convertDateRangeToMoment(reporting.existingRates)
);

// UI selectors
export const selectActiveTab = createSelector(
  [selectReportingState],
  (reporting) => reporting.ui.activeTab
);

export const selectIsFiltersExpanded = createSelector(
  [selectReportingState],
  (reporting) => reporting.ui.isFiltersExpanded
);

// Loading selectors
export const selectExecutiveSummaryMetricsLoading = createSelector(
  [selectReportingState],
  (reporting) => reporting.loading.executiveSummaryMetrics
);

export const selectExecutiveSummaryChartsLoading = createSelector(
  [selectReportingState],
  (reporting) => reporting.loading.executiveSummaryCharts
);

export const selectStreetRatesLoading = createSelector(
  [selectReportingState],
  (reporting) => reporting.loading.streetRatesData
);

export const selectExistingRatesLoading = createSelector(
  [selectReportingState],
  (reporting) => reporting.loading.existingRatesData
);

// Combined loading selectors
export const selectIsAnyLoading = createSelector([selectReportingState], (reporting) =>
  Object.values(reporting.loading).some(Boolean)
);

export const selectExecutiveSummaryLoading = createSelector(
  [selectReportingState],
  (reporting) =>
    reporting.loading.executiveSummaryMetrics || reporting.loading.executiveSummaryCharts
);

// Error selectors
export const selectExecutiveSummaryError = createSelector(
  [selectReportingState],
  (reporting) => reporting.errors.executiveSummary
);

export const selectStreetRatesError = createSelector(
  [selectReportingState],
  (reporting) => reporting.errors.streetRates
);

export const selectExistingRatesError = createSelector(
  [selectReportingState],
  (reporting) => reporting.errors.existingRates
);

export const selectHasAnyError = createSelector([selectReportingState], (reporting) =>
  Object.values(reporting.errors).some((error) => error !== null)
);

// Cache selectors
export const selectCachedData = createSelector(
  [selectReportingState],
  (reporting) => reporting.cache
);

export const selectExecutiveSummaryCachedData = createSelector(
  [selectReportingState],
  (reporting) => reporting.cache.executiveSummaryData
);

export const selectStreetRatesCachedData = createSelector(
  [selectReportingState],
  (reporting) => reporting.cache.streetRatesData
);

export const selectExistingRatesCachedData = createSelector(
  [selectReportingState],
  (reporting) => reporting.cache.existingRatesData
);

// API parameter selectors - convert filter state to API parameters
export const selectExecutiveSummaryApiParams = createSelector(
  [selectExecutiveSummaryFilters],
  (filters) => {
    const params = {};

    if (filters.dateRange?.[0]) {
      params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
    }
    if (filters.dateRange?.[1]) {
      params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
    }
    if (filters.facilityIds && filters.facilityIds.length > 0) {
      params.facilityIds = filters.facilityIds;
    }

    return params;
  }
);

export const selectStreetRatesApiParams = createSelector([selectStreetRatesFilters], (filters) => {
  const params = {};

  if (filters.dateRange?.[0]) {
    params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
  }
  if (filters.dateRange?.[1]) {
    params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
  }
  if (filters.facilityIds && filters.facilityIds.length > 0) {
    params.facilityIds = filters.facilityIds;
  }

  return params;
});

export const selectExistingRatesApiParams = createSelector(
  [selectExistingRatesFilters],
  (filters) => {
    const params = {};

    if (filters.dateRange?.[0]) {
      params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
    }
    if (filters.dateRange?.[1]) {
      params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
    }
    if (filters.facilityIds && filters.facilityIds.length > 0) {
      params.facilityIds = filters.facilityIds;
    }

    return params;
  }
);

// Utility selectors for current tab
export const selectCurrentTabFilters = createSelector(
  [
    selectActiveTab,
    selectExecutiveSummaryFilters,
    selectStreetRatesFilters,
    selectExistingRatesFilters,
  ],
  (activeTab, executiveSummary, streetRates, existingRates) => {
    switch (activeTab) {
      case 'executive-summary':
        return executiveSummary;
      case 'street-rates':
        return streetRates;
      case 'existing-rates':
        return existingRates;
      default:
        return executiveSummary;
    }
  }
);

export const selectCurrentTabApiParams = createSelector(
  [
    selectActiveTab,
    selectExecutiveSummaryApiParams,
    selectStreetRatesApiParams,
    selectExistingRatesApiParams,
  ],
  (activeTab, executiveSummary, streetRates, existingRates) => {
    switch (activeTab) {
      case 'executive-summary':
        return executiveSummary;
      case 'street-rates':
        return streetRates;
      case 'existing-rates':
        return existingRates;
      default:
        return executiveSummary;
    }
  }
);

export const selectCurrentTabLoading = createSelector(
  [
    selectActiveTab,
    selectExecutiveSummaryLoading,
    selectStreetRatesLoading,
    selectExistingRatesLoading,
  ],
  (activeTab, executiveSummary, streetRates, existingRates) => {
    switch (activeTab) {
      case 'executive-summary':
        return executiveSummary;
      case 'street-rates':
        return streetRates;
      case 'existing-rates':
        return existingRates;
      default:
        return false;
    }
  }
);

export const selectCurrentTabError = createSelector(
  [selectActiveTab, selectExecutiveSummaryError, selectStreetRatesError, selectExistingRatesError],
  (activeTab, executiveSummary, streetRates, existingRates) => {
    switch (activeTab) {
      case 'executive-summary':
        return executiveSummary;
      case 'street-rates':
        return streetRates;
      case 'existing-rates':
        return existingRates;
      default:
        return null;
    }
  }
);
