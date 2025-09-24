import { existingCustomersApi } from '@/api/existingCustomersApi';
import { createSlice } from '@reduxjs/toolkit';

const loadSavedTenantChangesFromStorage = () => {
  try {
    const saved = localStorage.getItem('savedTenantChanges');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  facilities: [],
  changedFacilities: [],
  newTenantChanges: [], // Array of full tenant objects with unsaved changes
  savedTenantChanges: loadSavedTenantChangesFromStorage(), // Array of full tenant objects with saved changes (loaded from localStorage)
};

const existingCustomersSlice = createSlice({
  name: 'existingCustomers',
  initialState,
  reducers: {
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

    addChangedTenant: (state, action) => {
      const tenant = action.payload; // Full tenant object
      const existingIndex = state.newTenantChanges.findIndex((t) => t.ecri_id === tenant.ecri_id);
      if (existingIndex >= 0) {
        state.newTenantChanges[existingIndex] = { ...tenant };
      } else {
        state.newTenantChanges.push({ ...tenant });
      }
    },

    removeChangedTenant: (state, action) => {
      const tenantId = action.payload;
      state.newTenantChanges = state.newTenantChanges.filter(
        (tenant) => tenant.ecri_id !== tenantId
      );
    },

    clearAllChangedTenants: (state) => {
      state.newTenantChanges = [];
      state.changedFacilities = [];
    },

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

    clearSavedTenantChanges: (state) => {
      state.savedTenantChanges = [];
    },

    clearSavedTenantChangesByIds: (state, action) => {
      const tenantIds = action.payload;
      state.savedTenantChanges = state.savedTenantChanges.filter(
        (tenant) => !tenantIds.includes(tenant.ecri_id)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      existingCustomersApi.endpoints.getExistingCustomers.matchFulfilled,
      (state, action) => {
        state.facilities = action.payload.result;
      }
    );
  },
});

export const {
  updateTenant,
  clearChangedTenantsByFacilityId,
  addChangedTenant,
  removeChangedTenant,
  clearAllChangedTenants,
  mergeToSavedTenantChanges,
  clearSavedTenantChanges,
  clearSavedTenantChangesByIds,
} = existingCustomersSlice.actions;

export default existingCustomersSlice.reducer;
