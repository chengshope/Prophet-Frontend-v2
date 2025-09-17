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

export const getChangedUnits = createSelector(
    [selectChangedFacilities],
    (changedFacilities) => {
        return changedFacilities.flatMap(f => f.units_statistics || []);
    }
);

// Select the rate changed unit keys
export const selectNewRateUnitKeys = (state) => state.street.newRateUnitKeys;

// Get actual unit objects that have rate changes
export const getRateChangedUnits = createSelector(
    [selectChangedFacilities, selectNewRateUnitKeys],
    (changedFacilities, newRateUnitKeys) => {
        const allChangedUnits = changedFacilities.flatMap(f => f.units_statistics || []);
        return allChangedUnits.filter(unit => newRateUnitKeys.includes(unit.ut_id));
    }
);

// Get rate changed units for a specific facility
export const getRateChangedUnitsByFacility = createSelector(
    [selectChangedFacilities, selectNewRateUnitKeys, (state, facilityId) => facilityId],
    (changedFacilities, newRateUnitKeys, facilityId) => {
        const facility = changedFacilities.find(f => f.facility_id === facilityId);
        if (!facility) return [];

        const facilityUnits = facility.units_statistics || [];
        return facilityUnits.filter(unit => newRateUnitKeys.includes(unit.ut_id));
    }
);
