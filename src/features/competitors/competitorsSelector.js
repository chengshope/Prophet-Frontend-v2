/**
 * Competitors Selectors
 * Following Rule #29: Use redux for api responses, Use useState for local state
 * Only keeping selectors for cached API responses (facilities)
 */

import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectCompetitorsState = (state) => state.competitors;

// Cache selectors (Rule #29: redux for api responses)
export const selectCachedFacilities = createSelector(
  [selectCompetitorsState],
  (competitors) => competitors.cache.facilities
);

// Facility options selector for dropdown (Rule #29: transform cached API response)
export const selectFacilityOptions = createSelector([selectCachedFacilities], (facilities) => {
  if (!facilities) return [];

  return facilities.map((facility) => ({
    // Enhanced label format like v1 (more context for better search)
    label: `${facility.facility_name} - ${facility.city || ''}, ${facility.state || ''}`.replace(
      / - ,/,
      ' -'
    ),
    value: facility.id,
    facility: facility, // Keep full facility object for reference
    // Additional search fields for better filtering
    searchText:
      `${facility.facility_name} ${facility.city || ''} ${facility.state || ''} ${facility.address || ''}`.toLowerCase(),
  }));
});
