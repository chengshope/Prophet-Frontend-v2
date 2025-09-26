import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Facility and search state
  selectedFacilityId: null,
  search: '',

  // Strategy state
  strategy: null, // Will be set from facility data

  // UI state
  mapCenter: { lat: 39.8283, lng: -98.5795 }, // Center of US
  hoveredCompetitor: null,

  // Loading states
  loading: {
    competitors: false,
    facilities: false,
    updating: false,
  },

  // Error states
  errors: {
    competitors: null,
    facilities: null,
    update: null,
  },

  // Cache for performance
  cache: {
    competitors: {},
    facilities: null,
    lastFetch: null,
  },
};

const competitorsSlice = createSlice({
  name: 'competitors',
  initialState,
  reducers: {
    // Facility selection
    setSelectedFacilityId: (state, action) => {
      state.selectedFacilityId = action.payload;
      // Reset search when facility changes
      state.search = '';
      // Reset hovered competitor
      state.hoveredCompetitor = null;
    },

    // Search functionality
    setSearch: (state, action) => {
      state.search = action.payload;
    },

    // Strategy management
    setStrategy: (state, action) => {
      state.strategy = action.payload;
    },

    // Map interactions
    setMapCenter: (state, action) => {
      state.mapCenter = action.payload;
    },

    setHoveredCompetitor: (state, action) => {
      state.hoveredCompetitor = action.payload;
    },

    // Loading state management
    setCompetitorsLoading: (state, action) => {
      state.loading.competitors = action.payload;
    },

    setFacilitiesLoading: (state, action) => {
      state.loading.facilities = action.payload;
    },

    setUpdatingLoading: (state, action) => {
      state.loading.updating = action.payload;
    },

    // Error state management
    setCompetitorsError: (state, action) => {
      state.errors.competitors = action.payload;
    },

    setFacilitiesError: (state, action) => {
      state.errors.facilities = action.payload;
    },

    setUpdateError: (state, action) => {
      state.errors.update = action.payload;
    },

    clearErrors: (state) => {
      state.errors = {
        competitors: null,
        facilities: null,
        update: null,
      };
    },

    // Cache management
    setCachedCompetitors: (state, action) => {
      const { facilityId, data } = action.payload;
      state.cache.competitors[facilityId] = data;
      state.cache.lastFetch = Date.now();
    },

    setCachedFacilities: (state, action) => {
      state.cache.facilities = action.payload;
    },

    clearCache: (state) => {
      state.cache = {
        competitors: {},
        facilities: null,
        lastFetch: null,
      };
    },

    // Reset functionality
    resetCompetitorsState: (state) => {
      return {
        ...initialState,
        // Preserve facility selection and strategy
        selectedFacilityId: state.selectedFacilityId,
        strategy: state.strategy,
      };
    },

    resetAllState: () => initialState,
  },
});

export const {
  // Facility and search actions
  setSelectedFacilityId,
  setSearch,

  // Strategy actions
  setStrategy,

  // Map actions
  setMapCenter,
  setHoveredCompetitor,

  // Loading actions
  setCompetitorsLoading,
  setFacilitiesLoading,
  setUpdatingLoading,

  // Error actions
  setCompetitorsError,
  setFacilitiesError,
  setUpdateError,
  clearErrors,

  // Cache actions
  setCachedCompetitors,
  setCachedFacilities,
  clearCache,

  // Reset actions
  resetCompetitorsState,
  resetAllState,
} = competitorsSlice.actions;

export default competitorsSlice.reducer;
