/**
 * Selectors for StreetRate page state
 * Following Rule #2: Centralized state access via selectors
 */

import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectStreetRateState = (state) => state.streetRate;

// Filter selectors
export const selectStreetRateFilters = createSelector(
  [selectStreetRateState],
  (pageState) => pageState.filters
);

export const selectSearch = createSelector([selectStreetRateFilters], (filters) => filters.search);

export const selectSort = createSelector([selectStreetRateFilters], (filters) => filters.sort);

export const selectOrderBy = createSelector(
  [selectStreetRateFilters],
  (filters) => filters.orderby
);

// Pagination selectors
export const selectStreetRatePagination = createSelector(
  [selectStreetRateState],
  (pageState) => pageState.pagination
);

export const selectCurrentPage = createSelector(
  [selectStreetRatePagination],
  (pagination) => pagination.currentPage
);

export const selectPageSize = createSelector(
  [selectStreetRatePagination],
  (pagination) => pagination.pageSize
);

// UI selectors
export const selectStreetRateUI = createSelector(
  [selectStreetRateState],
  (pageState) => pageState.ui
);

export const selectPublishModalOpen = createSelector(
  [selectStreetRateUI],
  (ui) => ui.publishModalOpen
);

export const selectErrorModalOpen = createSelector([selectStreetRateUI], (ui) => ui.errorModalOpen);

export const selectErrorLog = createSelector([selectStreetRateUI], (ui) => ui.errorLog);

export const selectLatestPublishedDate = createSelector(
  [selectStreetRateUI],
  (ui) => ui.latestPublishedDate
);

// Loading selectors
export const selectStreetRateLoading = createSelector(
  [selectStreetRateState],
  (pageState) => pageState.loading
);

export const selectFacilitiesLoading = createSelector(
  [selectStreetRateLoading],
  (loading) => loading.facilities
);

export const selectPublishingLoading = createSelector(
  [selectStreetRateLoading],
  (loading) => loading.publishing
);

export const selectRefreshingLoading = createSelector(
  [selectStreetRateLoading],
  (loading) => loading.refreshing
);

export const selectExportingLoading = createSelector(
  [selectStreetRateLoading],
  (loading) => loading.exporting
);

// Error selectors
export const selectStreetRateErrors = createSelector(
  [selectStreetRateState],
  (pageState) => pageState.errors
);

// API parameter selectors
export const selectStreetRatesApiParams = createSelector(
  [selectCurrentPage, selectPageSize, selectSearch, selectSort, selectOrderBy],
  (currentPage, pageSize, search, sort, orderby) => ({
    page: currentPage,
    limit: pageSize,
    search,
    sort,
    orderby,
    status: 'enabled',
  })
);

// Combined selectors for components
export const selectPaginationConfig = createSelector(
  [selectCurrentPage, selectPageSize],
  (currentPage, pageSize) => ({
    current: currentPage,
    pageSize,
    showSizeChanger: false,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} facilities`,
  })
);
