import { createSelector } from '@reduxjs/toolkit';

// Data selectors (still used by components)
export const selectExistingCustomersFacilities = (state) => state.existingCustomers.facilities;
export const selectChangedFacilities = (state) => state.existingCustomers.changedFacilities;

// UI selectors (still used by ExistingCustomersTable)
export const selectExpandedRowKeys = createSelector(
  [(state) => state.existingCustomers.ui],
  (ui) => ui.expandedRowKeys
);
export const selectSelectedFacility = createSelector(
  [(state) => state.existingCustomers.ui],
  (ui) => ui.selectedFacility
);

// Tenant changes selectors (used by components)
export const selectNewTenantChanges = (state) => state.existingCustomers.newTenantChanges;
export const selectSavedTenantChanges = (state) => state.existingCustomers.savedTenantChanges;

// Get changed tenants by facility ID (used by ExistingCustomersTable)
export const getChangedTenantsByFacilityId = createSelector(
  [selectChangedFacilities],
  (changedFacilities) =>
    changedFacilities.reduce((acc, facility) => {
      acc[facility.facility_id] = facility.tenants || [];
      return acc;
    }, {})
);

// Get ECRI IDs of saved tenant changes (used by ExistingCustomers page)
export const getSavedEcriIds = createSelector([selectSavedTenantChanges], (savedTenantChanges) => {
  return savedTenantChanges.map((tenant) => tenant.ecri_id);
});

// Get facilities with changes count (used by ExistingCustomers page)
export const getFacilitiesWithChangesCount = createSelector(
  [selectChangedFacilities],
  (changedFacilities) => changedFacilities.length
);

// Check if facility has saved changes (used by table columns)
export const getFacilityHasSavedChanges = createSelector(
  [selectSavedTenantChanges, (state, facilityId) => facilityId],
  (savedTenantChanges, facilityId) => {
    return savedTenantChanges.some((tenant) => tenant.facility_id === facilityId);
  }
);

// Calculate summary statistics from facilities data (used by ExistingCustomers page)
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
