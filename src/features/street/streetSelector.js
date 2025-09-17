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

export const getRateChangedUnits = createSelector(
    [selectChangedFacilities],
    (changedFacilities) => {
        return changedFacilities.flatMap(f => f.units_statistics || []);
    }
);
