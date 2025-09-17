// Add a unit to a facility (avoid duplicates)
export function addUnit(facilities, facilityId, unit) {
  if (!Array.isArray(facilities)) return [];
  if (!facilityId || !unit || !unit.id) return facilities;

  return facilities.map((facility) => {
    if (facility?.id !== facilityId) return facility;

    const units = Array.isArray(facility.units) ? facility.units : [];
    const exists = units.some((u) => u.id === unit.id);

    return exists
      ? facility
      : {
          ...facility,
          units: [...units, unit],
        };
  });
}

// Remove a facility by ID
export function removeFacility(facilities, facilityId) {
  if (!Array.isArray(facilities)) return []; // safe fallback
  return facilities.filter((f) => f?.id !== facilityId);
}

// Get all units for a facility
export function getUnitsByFacilityId(facilities, facilityId) {
  if (!Array.isArray(facilities)) return [];
  const facility = facilities.find((f) => f?.id === facilityId);
  return Array.isArray(facility?.units) ? [...facility.units] : [];
}

// Get units by an array of unit IDs across all facilities
export function getUnitsByIds(facilities, unitIds) {
  if (!Array.isArray(facilities) || !Array.isArray(unitIds)) return [];
  const idSet = new Set(unitIds);

  return facilities.flatMap((facility) =>
    Array.isArray(facility?.units) ? facility.units.filter((unit) => idSet.has(unit.id)) : []
  );
}

// Get units by facility ID and a set of unit IDs
export function getUnitsByFacilityAndIds(facilities, facilityId, unitIds) {
  if (!Array.isArray(facilities) || !Array.isArray(unitIds)) return [];
  const facility = facilities.find((f) => f?.id === facilityId);
  if (!facility) return [];

  const idSet = new Set(unitIds);
  return Array.isArray(facility.units) ? facility.units.filter((unit) => idSet.has(unit.id)) : [];
}

export function addOrUpdateUnitInFacility(facility, unit) {
  if (!facility.units_statistics) facility.units_statistics = [];

  const unitIndex = facility.units_statistics.findIndex((u) => u.ut_id === unit.ut_id);
  if (unitIndex !== -1) {
    facility.units_statistics[unitIndex] = { ...facility.units_statistics[unitIndex], ...unit };
  } else {
    facility.units_statistics.push(unit);
  }

  return facility;
}

export function trackChangedFacility(changedFacilities, facility, unit) {
  const existingFacility = changedFacilities.find((f) => f.facility_id === facility.facility_id);

  if (existingFacility) {
    const updatedUnits = existingFacility.units_statistics
      ? existingFacility.units_statistics.map((u) =>
          u.ut_id === unit.ut_id ? { ...u, ...unit } : u
        )
      : [unit];

    if (!updatedUnits.some((u) => u.ut_id === unit.ut_id)) updatedUnits.push(unit);

    return changedFacilities.map((f) =>
      f.facility_id === facility.facility_id ? { ...f, units_statistics: updatedUnits } : f
    );
  }

  return [...changedFacilities, { ...facility, units_statistics: [unit] }];
}
