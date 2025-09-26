import { createSelector } from '@reduxjs/toolkit';

const selectCompetitorsState = (state) => state.competitors;

export const selectCachedFacilities = createSelector(
  [selectCompetitorsState],
  (competitors) => competitors.cache.facilities
);

export const selectFacilityOptions = createSelector([selectCachedFacilities], (facilities) => {
  if (!facilities) return [];

  return facilities.map((facility) => ({
    label: `${facility.facility_name} - ${facility.city || ''}, ${facility.state || ''}`.replace(
      / - ,/,
      ' -'
    ),
    value: facility.id,
    facility: facility,
    searchText:
      `${facility.facility_name} ${facility.city || ''} ${facility.state || ''} ${facility.address || ''}`.toLowerCase(),
  }));
});
