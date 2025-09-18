import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
export const selectExistingCustomersFacilities = (state) => state.existingCustomers.facilities;
export const selectExistingCustomersTotal = (state) => state.existingCustomers.total;
export const selectChangedFacilities = (state) => state.existingCustomers.changedFacilities;
export const selectSummaryData = (state) => state.existingCustomers.summaryData;
export const selectPagination = (state) => state.existingCustomers.pagination;

// Select tenant changes
export const selectNewTenantChanges = (state) => state.existingCustomers.newTenantChanges;
export const selectSavedTenantChanges = (state) => state.existingCustomers.savedTenantChanges;

// Get changed tenants by facility ID (similar to street rates)
export const getChangedTenantsByFacilityId = createSelector(
  [selectChangedFacilities],
  (changedFacilities) =>
    changedFacilities.reduce((acc, facility) => {
      acc[facility.facility_id] = facility.tenants || [];
      return acc;
    }, {})
);

// Get all changed tenants (flattened)
export const getChangedTenants = createSelector([selectChangedFacilities], (changedFacilities) => {
  return changedFacilities.flatMap((f) => f.tenants || []);
});

// Get unsaved tenant changes (direct access)
export const getNewTenantChanges = createSelector(
  [selectNewTenantChanges],
  (newTenantChanges) => newTenantChanges
);

// Get saved tenant changes (direct access, ready for publishing)
export const getSavedTenantChanges = createSelector(
  [selectSavedTenantChanges],
  (savedTenantChanges) => savedTenantChanges
);

// Get unsaved tenant changes for a specific facility
export const getNewTenantChangesByFacility = createSelector(
  [selectNewTenantChanges, (state, facilityId) => facilityId],
  (newTenantChanges, facilityId) => {
    return newTenantChanges.filter((tenant) => tenant.facility_id === facilityId);
  }
);

// Get saved tenant changes for a specific facility
export const getSavedTenantChangesByFacility = createSelector(
  [selectSavedTenantChanges, (state, facilityId) => facilityId],
  (savedTenantChanges, facilityId) => {
    return savedTenantChanges.filter((tenant) => tenant.facility_id === facilityId);
  }
);

// Get ECRI IDs of changed tenants (for v1 compatibility)
export const getChangedEcriIds = createSelector([selectNewTenantChanges], (newTenantChanges) => {
  return newTenantChanges.map((tenant) => tenant.ecri_id);
});

// Get ECRI IDs of saved tenant changes (ready for publishing)
export const getSavedEcriIds = createSelector([selectSavedTenantChanges], (savedTenantChanges) => {
  return savedTenantChanges.map((tenant) => tenant.ecri_id);
});

// Get facilities with changes count
export const getFacilitiesWithChangesCount = createSelector(
  [selectChangedFacilities],
  (changedFacilities) => changedFacilities.length
);

// Get total tenants with changes count
export const getTotalTenantsWithChangesCount = createSelector(
  [selectNewTenantChanges],
  (newTenantChanges) => newTenantChanges.length
);

// Get total saved tenants count
export const getTotalSavedTenantsCount = createSelector(
  [selectSavedTenantChanges],
  (savedTenantChanges) => savedTenantChanges.length
);

// Check if facility has changes
export const getFacilityHasChanges = createSelector(
  [selectChangedFacilities, (state, facilityId) => facilityId],
  (changedFacilities, facilityId) => {
    return changedFacilities.some((facility) => facility.facility_id === facilityId);
  }
);

// Check if facility has saved changes ready for publishing
export const getFacilityHasSavedChanges = createSelector(
  [selectSavedTenantChanges, (state, facilityId) => facilityId],
  (savedTenantChanges, facilityId) => {
    return savedTenantChanges.some((tenant) => tenant.facility_id === facilityId);
  }
);

// Calculate summary statistics from facilities data (matching v1 logic)
export const getFormattedSummaryData = createSelector(
  [selectExistingCustomersFacilities],
  (facilities) => {
    if (!facilities || facilities.length === 0) {
      return {
        totalTenants: 0,
        averageRateIncrease: '0.0',
        estimatedRevenueIncrease: '0',
        averageMoveOutProbability: '0.0',
      };
    }

    let sum_tenants = 0;
    let sum_avr_rate_inc = 0;
    let sum_rev_inc = 0;
    let sum_avr_mop = 0;
    let fc_length = 0;

    for (const fc of facilities) {
      if (!fc.tenants || !fc.tenants.length) continue;
      fc_length++;
      sum_avr_rate_inc += fc.avr_rate_increase_percent || 0;
      sum_avr_mop += (fc.avr_moveout_probability || 0) * 100.0;

      for (const tnt of fc.tenants) {
        if (!tnt.exclude_submit) {
          sum_tenants++;
          const newRate = tnt.new_rate || tnt.current_rate;
          const currentRate = tnt.current_rate || 0;
          if (currentRate > 0) {
            sum_rev_inc += ((newRate - currentRate) * 100.0) / currentRate;
          }
        }
      }
    }

    return {
      totalTenants: sum_tenants,
      averageRateIncrease: fc_length > 0 ? (sum_avr_rate_inc / fc_length).toFixed(1) : '0.0',
      estimatedRevenueIncrease: sum_tenants > 0 ? (sum_rev_inc / sum_tenants).toFixed(1) : '0.0',
      averageMoveOutProbability: fc_length > 0 ? (sum_avr_mop / fc_length).toFixed(1) : '0.0',
    };
  }
);

// Get tenants for bulk update (v1 format)
export const getTenantsForBulkUpdate = createSelector(
  [selectNewTenantChanges],
  (newTenantChanges) => {
    return newTenantChanges.map((tenant) => ({
      id: tenant.ecri_id,
      new_rate: parseFloat(tenant.new_rate),
      exclude_submit: tenant.exclude_submit || false,
    }));
  }
);

// Get saved tenants for bulk update (v1 format)
export const getSavedTenantsForBulkUpdate = createSelector(
  [selectSavedTenantChanges],
  (savedTenantChanges) => {
    return savedTenantChanges.map((tenant) => ({
      id: tenant.ecri_id,
      new_rate: parseFloat(tenant.new_rate),
      exclude_submit: tenant.exclude_submit || false,
    }));
  }
);
