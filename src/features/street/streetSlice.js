import { streetRatesApi } from '@/api/streetRatesApi';
import { addOrUpdateUnitInFacility, trackChangedFacility } from '@/utils/facilityHelpers';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  total: 0,
  facilities: [],
  changedFacilities: [],
  newRateUnitKeys: []
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
        const unitKey = unit.ut_id;
        if (!state.newRateUnitKeys.includes(unitKey)) {
          state.newRateUnitKeys.push(unitKey);
        }
      }
    },
    clearChangedUnitByFacilityId: (state, action) => {
      const facilityId = action.payload;
      state.changedFacilities = state.changedFacilities.filter(
        (f) => f.facility_id !== facilityId
      );

      // Also remove rate change tracking for units in this facility
      const facility = state.facilities.find((f) => f.facility_id === facilityId);
      if (facility && facility.units_statistics) {
        const facilityUnitIds = facility.units_statistics.map(unit => unit.ut_id);
        state.newRateUnitKeys = state.newRateUnitKeys.filter(
          unitId => !facilityUnitIds.includes(unitId)
        );
      }
    },
    addRateChangedUnit: (state, action) => {
      const unitId = action.payload;
      if (!state.newRateUnitKeys.includes(unitId)) {
        state.newRateUnitKeys.push(unitId);
      }
    },
    removeRateChangedUnit: (state, action) => {
      const unitId = action.payload;
      state.newRateUnitKeys = state.newRateUnitKeys.filter(id => id !== unitId);
    },
    clearAllRateChangedUnits: (state) => {
      state.newRateUnitKeys = [];
    },
    clearRateChangedUnitsByFacility: (state, action) => {
      const facilityId = action.payload;
      const facility = state.facilities.find((f) => f.facility_id === facilityId);
      if (facility && facility.units_statistics) {
        const facilityUnitIds = facility.units_statistics.map(unit => unit.ut_id);
        state.newRateUnitKeys = state.newRateUnitKeys.filter(
          unitId => !facilityUnitIds.includes(unitId)
        );
      }
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
  clearRateChangedUnitsByFacility
} = streetSlice.actions;
export default streetSlice.reducer;
