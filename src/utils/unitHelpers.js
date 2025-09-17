export const getSecondaryUnitTypeLabel = (guide) => {
  switch (guide) {
    case 'drive_up':
      return 'Drive Up';
    case 'climate_controlled':
      return 'Climate Controlled';
    case 'parking':
      return 'Parking';
    default:
      return '';
  }
};
