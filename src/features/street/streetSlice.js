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
    },
    clearChangedUnitByFacilityId: (state, action) => {
      const facilityId = action.payload;
      state.changedFacilities = state.changedFacilities.filter(
        (f) => f.facility_id !== facilityId
      );
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

export const { updateFacility, clearChangedUnitByFacilityId } = streetSlice.actions;
export default streetSlice.reducer;
