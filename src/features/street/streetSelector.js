import { createSelector } from '@reduxjs/toolkit';

export const selectStreetFacilities = (state) => state.street.facilities;

export const selectStreetTotal = (state) => state.street.total;

export const selectChangedFacilities = (state) => state.street.changedFacilities;

export const getChangedUnitsByFacilityId = createSelector(
  [selectChangedFacilities],
  (changedFacilities) =>
    changedFacilities.reduce((acc, facility) => {
      acc[facility.facility_id] = facility.units_statistics || [];
      return acc;
    }, {})
);

export const getChangedUnits = createSelector([selectChangedFacilities], (changedFacilities) => {
  return changedFacilities.flatMap((f) => f.units_statistics || []);
});

// Select the unsaved rate changed units (full objects)
export const selectNewRateUnits = (state) => state.street.newRateUnits;

// Select the saved rate changed units (full objects, ready for publishing)
export const selectSavedRateUnits = (state) => state.street.savedRateUnits;

// Get unsaved rate changed units (direct access, no filtering needed)
export const getRateChangedUnits = createSelector(
  [selectNewRateUnits],
  (newRateUnits) => newRateUnits
);

// Get saved rate changed units (direct access, no filtering needed)
export const getSavedRateChangedUnits = createSelector(
  [selectSavedRateUnits],
  (savedRateUnits) => savedRateUnits
);

// Get unsaved rate changed units for a specific facility
export const getRateChangedUnitsByFacility = createSelector(
  [selectNewRateUnits, (state, facilityId) => facilityId],
  (newRateUnits, facilityId) => {
    return newRateUnits.filter((unit) => unit.facility_id === facilityId);
  }
);

// Get saved rate changed units for a specific facility
export const getSavedRateChangedUnitsByFacility = createSelector(
  [selectSavedRateUnits, (state, facilityId) => facilityId],
  (savedRateUnits, facilityId) => {
    return savedRateUnits.filter((unit) => unit.facility_id === facilityId);
  }
);
