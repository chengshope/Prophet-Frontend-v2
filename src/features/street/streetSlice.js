import { streetRatesApi } from '@/api/streetRatesApi';
import { addOrUpdateUnitInFacility, trackChangedFacility } from '@/utils/facilityHelpers';
import { createSlice } from '@reduxjs/toolkit';

// Load saved rate units from localStorage for initialState
const loadSavedRateUnitsFromStorage = () => {
  try {
    const saved = localStorage.getItem('savedRateUnits');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  total: 0,
  facilities: [],
  changedFacilities: [],
  newRateUnits: [], // Array of full unit objects with unsaved rate changes
  savedRateUnits: loadSavedRateUnitsFromStorage(), // Array of full unit objects with saved rate changes (loaded from localStorage)
};

const streetSlice = createSlice({
  name: 'streetRates',
  initialState,
  reducers: {
    updateFacility: (state, action) => {
      const { facilityId, unit, newRate = false } = action.payload;

      const facility = state.facilities.find((f) => f.facility_id === facilityId);
      if (!facility) return;

      const updatedFacility = addOrUpdateUnitInFacility(facility, unit);
      state.facilities = state.facilities.map((f) =>
        f.facility_id === facilityId ? updatedFacility : f
      );

      state.changedFacilities = trackChangedFacility(state.changedFacilities, facility, unit);

      // Track rate changes separately for publishing
      if (newRate && (unit.new_std_rate !== undefined || unit.new_web_rate !== undefined)) {
        // Add or update the full unit object in newRateUnits
        const existingIndex = state.newRateUnits.findIndex((u) => u.ut_id === unit.ut_id);

        // Ensure unit has facility_id for proper filtering
        const unitWithFacilityId = { ...unit, facility_id: facilityId };

        if (existingIndex >= 0) {
          state.newRateUnits[existingIndex] = unitWithFacilityId;
        } else {
          state.newRateUnits.push(unitWithFacilityId);
        }
      }
    },
    clearChangedUnitByFacilityId: (state, action) => {
      const facilityId = action.payload;
      state.changedFacilities = state.changedFacilities.filter((f) => f.facility_id !== facilityId);

      // Also remove rate change tracking for units in this facility
      const facility = state.facilities.find((f) => f.facility_id === facilityId);
      if (facility && facility.units_statistics) {
        const facilityUnitIds = facility.units_statistics.map((unit) => unit.ut_id);
        state.newRateUnits = state.newRateUnits.filter(
          (unit) => !facilityUnitIds.includes(unit.ut_id)
        );
      }
    },
    addRateChangedUnit: (state, action) => {
      const { unit, facilityId } = action.payload; // Support both unit object and facilityId
      const existingIndex = state.newRateUnits.findIndex((u) => u.ut_id === unit.ut_id);

      // Ensure unit has facility_id for proper filtering
      const unitWithFacilityId = { ...unit, facility_id: facilityId || unit.facility_id };

      if (existingIndex >= 0) {
        state.newRateUnits[existingIndex] = unitWithFacilityId;
      } else {
        state.newRateUnits.push(unitWithFacilityId);
      }
    },
    removeRateChangedUnit: (state, action) => {
      const unitId = action.payload;
      state.newRateUnits = state.newRateUnits.filter((unit) => unit.ut_id !== unitId);
    },
    clearAllRateChangedUnits: (state) => {
      state.newRateUnits = [];
    },
    clearRateChangedUnitsByFacility: (state, action) => {
      const facilityId = action.payload;
      state.newRateUnits = state.newRateUnits.filter((unit) => unit.facility_id !== facilityId);
    },
    // Actions for saved rate changes (ready for publishing)
    mergeToSavedRateChanges: (state, action) => {
      const newRateUnits = action.payload; // Array of unit objects from newRateUnits

      newRateUnits.forEach((newUnit) => {
        const existingIndex = state.savedRateUnits.findIndex((u) => u.ut_id === newUnit.ut_id);
        if (existingIndex >= 0) {
          // Override existing with new data
          state.savedRateUnits[existingIndex] = { ...newUnit, saved_at: new Date().toISOString() };
        } else {
          // Add new unit
          state.savedRateUnits.push({ ...newUnit, saved_at: new Date().toISOString() });
        }
      });

      // Clear the units from newRateUnits after moving to saved
      const movedUnitIds = newRateUnits.map((unit) => unit.ut_id);
      state.newRateUnits = state.newRateUnits.filter((unit) => !movedUnitIds.includes(unit.ut_id));
    },
    clearSavedRateChanges: (state) => {
      state.savedRateUnits = [];
    },
    clearSavedRateChangesByIds: (state, action) => {
      const unitIds = action.payload;
      state.savedRateUnits = state.savedRateUnits.filter((unit) => !unitIds.includes(unit.ut_id));
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      streetRatesApi.endpoints.getStreetRatesFacilities.matchFulfilled,
      (state, action) => {
        state.facilities = action.payload.result;
        state.total = action.payload.pagination.total;
      }
    );
  },
});

export const {
  updateFacility,
  clearChangedUnitByFacilityId,
  addRateChangedUnit,
  removeRateChangedUnit,
  clearAllRateChangedUnits,
  clearRateChangedUnitsByFacility,
  mergeToSavedRateChanges,
  clearSavedRateChanges,
  clearSavedRateChangesByIds,
} = streetSlice.actions;
export default streetSlice.reducer;
