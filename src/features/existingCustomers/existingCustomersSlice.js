import { existingCustomersApi } from '@/api/existingCustomersApi';
import { createSlice } from '@reduxjs/toolkit';

// Load saved tenant changes from localStorage for initialState
const loadSavedTenantChangesFromStorage = () => {
  try {
    const saved = localStorage.getItem('savedTenantChanges');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  // Data
  total: 0,
  facilities: [],
  changedFacilities: [],
  newTenantChanges: [], // Array of full tenant objects with unsaved changes
  savedTenantChanges: loadSavedTenantChangesFromStorage(), // Array of full tenant objects with saved changes (loaded from localStorage)
  summaryData: {
    totalTenants: 0,
    averageRateIncrease: 0,
    estimatedRevenueIncrease: 0,
    averageMoveOutProbability: 0,
  },

  // Filters and Search
  filters: {
    search: '',
    sort: 'facility_name',
    orderby: 'asc',
  },

  // Pagination
  pagination: {
    currentPage: 1,
    pageSize: 10,
  },

  // UI State
  ui: {
    publishModalOpen: false,
    errorModalOpen: false,
    errorLog: '',
    latestPublishedDate: '',
    expandedRowKeys: [],
    selectedFacility: null,
  },

  // Loading States
  loading: {
    publishing: false,
    refreshing: false,
    exporting: false,
  },

  // Error States
  errors: {
    publish: null,
    refresh: null,
    export: null,
  },
};

const existingCustomersSlice = createSlice({
  name: 'existingCustomers',
  initialState,
  reducers: {
    // Filter and Search Actions
    setSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1; // Reset to first page on search
    },

    setSort: (state, action) => {
      const { field, direction } = action.payload;
      state.filters.sort = field;
      state.filters.orderby = direction;
    },

    // Pagination Actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1; // Reset to first page on page size change
    },

    // UI State Actions
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

    setExpandedRowKeys: (state, action) => {
      state.ui.expandedRowKeys = action.payload;
    },

    setSelectedFacility: (state, action) => {
      state.ui.selectedFacility = action.payload;
    },

    // Loading State Actions
    setPublishingLoading: (state, action) => {
      state.loading.publishing = action.payload;
    },

    setRefreshingLoading: (state, action) => {
      state.loading.refreshing = action.payload;
    },

    setExportingLoading: (state, action) => {
      state.loading.exporting = action.payload;
    },

    // Error State Actions
    setPublishError: (state, action) => {
      state.errors.publish = action.payload;
    },

    setRefreshError: (state, action) => {
      state.errors.refresh = action.payload;
    },

    setExportError: (state, action) => {
      state.errors.export = action.payload;
    },

    // Clear all errors
    clearErrors: (state) => {
      state.errors = {
        publish: null,
        refresh: null,
        export: null,
      };
    },
    // Update tenant data (similar to updateFacility in street rates)
    updateTenant: (state, action) => {
      const { facilityId, tenant, hasChanges = false } = action.payload;

      const facility = state.facilities.find((f) => f.facility_id === facilityId);
      if (!facility) return;

      // Update tenant in facility
      const updatedTenants = facility.tenants.map((t) =>
        t.ecri_id === tenant.ecri_id ? { ...t, ...tenant } : t
      );

      const updatedFacility = {
        ...facility,
        tenants: updatedTenants,
      };

      state.facilities = state.facilities.map((f) =>
        f.facility_id === facilityId ? updatedFacility : f
      );

      // Track changed facilities (similar to street rates)
      if (hasChanges) {
        const existingChangedFacilityIndex = state.changedFacilities.findIndex(
          (f) => f.facility_id === facilityId
        );

        if (existingChangedFacilityIndex >= 0) {
          state.changedFacilities[existingChangedFacilityIndex] = updatedFacility;
        } else {
          state.changedFacilities.push(updatedFacility);
        }

        // Track individual tenant changes for bulk update
        const existingTenantIndex = state.newTenantChanges.findIndex(
          (t) => t.ecri_id === tenant.ecri_id
        );

        // Ensure tenant has facility_id for proper filtering
        const tenantWithFacilityId = { ...tenant, facility_id: facilityId };

        if (existingTenantIndex >= 0) {
          state.newTenantChanges[existingTenantIndex] = tenantWithFacilityId;
        } else {
          state.newTenantChanges.push(tenantWithFacilityId);
        }
      }
    },

    // Clear changed tenants for a facility
    clearChangedTenantsByFacilityId: (state, action) => {
      const facilityId = action.payload;

      // Remove facility from changed facilities
      state.changedFacilities = state.changedFacilities.filter((f) => f.facility_id !== facilityId);

      // Remove tenants from this facility from new changes
      const facility = state.facilities.find((f) => f.facility_id === facilityId);
      if (facility && facility.tenants) {
        const facilityTenantIds = facility.tenants.map((tenant) => tenant.ecri_id);
        state.newTenantChanges = state.newTenantChanges.filter(
          (tenant) => !facilityTenantIds.includes(tenant.ecri_id)
        );
      }
    },

    // Add tenant to changed list
    addChangedTenant: (state, action) => {
      const tenant = action.payload; // Full tenant object
      const existingIndex = state.newTenantChanges.findIndex((t) => t.ecri_id === tenant.ecri_id);
      if (existingIndex >= 0) {
        state.newTenantChanges[existingIndex] = { ...tenant };
      } else {
        state.newTenantChanges.push({ ...tenant });
      }
    },

    // Remove tenant from changed list
    removeChangedTenant: (state, action) => {
      const tenantId = action.payload;
      state.newTenantChanges = state.newTenantChanges.filter(
        (tenant) => tenant.ecri_id !== tenantId
      );
    },

    // Clear all changed tenants
    clearAllChangedTenants: (state) => {
      state.newTenantChanges = [];
      state.changedFacilities = [];
    },

    // Actions for saved tenant changes (ready for publishing)
    mergeToSavedTenantChanges: (state, action) => {
      const newTenantChanges = action.payload; // Array of tenant objects from newTenantChanges

      newTenantChanges.forEach((newTenant) => {
        const existingIndex = state.savedTenantChanges.findIndex(
          (t) => t.ecri_id === newTenant.ecri_id
        );
        if (existingIndex >= 0) {
          // Override existing with new data
          state.savedTenantChanges[existingIndex] = {
            ...newTenant,
            saved_at: new Date().toISOString(),
          };
        } else {
          // Add new tenant
          state.savedTenantChanges.push({ ...newTenant, saved_at: new Date().toISOString() });
        }
      });

      // Clear the tenants from newTenantChanges after moving to saved
      const movedTenantIds = newTenantChanges.map((tenant) => tenant.ecri_id);
      state.newTenantChanges = state.newTenantChanges.filter(
        (tenant) => !movedTenantIds.includes(tenant.ecri_id)
      );
    },

    // Clear saved tenant changes
    clearSavedTenantChanges: (state) => {
      state.savedTenantChanges = [];
    },

    // Clear saved tenant changes by IDs
    clearSavedTenantChangesByIds: (state, action) => {
      const tenantIds = action.payload;
      state.savedTenantChanges = state.savedTenantChanges.filter(
        (tenant) => !tenantIds.includes(tenant.ecri_id)
      );
    },

    // Update pagination
    updatePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Handle API responses
    builder.addMatcher(
      existingCustomersApi.endpoints.getExistingCustomers.matchFulfilled,
      (state, action) => {
        state.facilities = action.payload.result;
        state.total = action.payload.pagination?.total || 0;
      }
    );

    builder.addMatcher(
      existingCustomersApi.endpoints.getExistingCustomersSummary.matchFulfilled,
      (state, action) => {
        const summary = action.payload;
        state.summaryData = {
          totalTenants: summary.sum_tenants || 0,
          averageRateIncrease: summary.sum_avr_rate_inc || 0,
          estimatedRevenueIncrease: summary.sum_rev_inc || 0,
          averageMoveOutProbability: summary.sum_avr_mop || 0,
        };
      }
    );
  },
});

export const {
  // Filter and Search Actions
  setSearch,
  setSort,

  // Pagination Actions
  setCurrentPage,
  setPageSize,

  // UI State Actions
  setPublishModalOpen,
  setErrorModalOpen,
  setErrorLog,
  setLatestPublishedDate,
  setExpandedRowKeys,
  setSelectedFacility,

  // Loading State Actions
  setPublishingLoading,
  setRefreshingLoading,
  setExportingLoading,

  // Error State Actions
  setPublishError,
  setRefreshError,
  setExportError,
  clearErrors,

  // Existing Tenant Actions
  updateTenant,
  clearChangedTenantsByFacilityId,
  addChangedTenant,
  removeChangedTenant,
  clearAllChangedTenants,
  mergeToSavedTenantChanges,
  clearSavedTenantChanges,
  clearSavedTenantChangesByIds,
  updatePagination,
} = existingCustomersSlice.actions;

export default existingCustomersSlice.reducer;
