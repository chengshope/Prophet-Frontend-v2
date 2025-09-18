// Local storage utilities for tracking changes

export const getChangedEcriIDs = () => {
  try {
    return JSON.parse(localStorage.getItem('changedEcriIDs') || '[]');
  } catch {
    return [];
  }
};

export const setChangedEcriIDs = (ids) => {
  localStorage.setItem('changedEcriIDs', JSON.stringify(ids));
};

export const removeChangedEcriIDs = () => {
  localStorage.removeItem('changedEcriIDs');
};

export const getChangedUnitStatistics = () => {
  try {
    return JSON.parse(localStorage.getItem('changedUnitStatistics') || '[]');
  } catch {
    return [];
  }
};

export const setChangedUnitStatistics = (ids) => {
  localStorage.setItem('changedUnitStatistics', JSON.stringify(ids));
};

export const removeChangedUnitStatistics = () => {
  localStorage.removeItem('changedUnitStatistics');
};

// Utilities for saved rate units (ready for publishing)
export const getSavedRateUnits = () => {
  try {
    return JSON.parse(localStorage.getItem('savedRateUnits') || '[]');
  } catch {
    return [];
  }
};

export const setSavedRateUnits = (rateUnits) => {
  localStorage.setItem('savedRateUnits', JSON.stringify(rateUnits));
};

export const removeSavedRateUnits = () => {
  localStorage.removeItem('savedRateUnits');
};

export const mergeSavedRateUnits = (newRateUnits) => {
  const existing = getSavedRateUnits();
  const updated = [...existing];

  newRateUnits.forEach((newUnit) => {
    const existingIndex = updated.findIndex((item) => item.ut_id === newUnit.ut_id);
    if (existingIndex >= 0) {
      // Override existing with new data
      updated[existingIndex] = { ...newUnit, saved_at: new Date().toISOString() };
    } else {
      // Add new unit
      updated.push({ ...newUnit, saved_at: new Date().toISOString() });
    }
  });

  setSavedRateUnits(updated);
  return updated;
};

export const removeSavedRateUnitsByIds = (unitIds) => {
  const existing = getSavedRateUnits();
  const filtered = existing.filter((item) => !unitIds.includes(item.ut_id));
  setSavedRateUnits(filtered);
  return filtered;
};

// Utilities for saved tenant changes (existing customers)
export const getSavedTenantChanges = () => {
  try {
    return JSON.parse(localStorage.getItem('savedTenantChanges') || '[]');
  } catch {
    return [];
  }
};

export const setSavedTenantChanges = (tenantChanges) => {
  localStorage.setItem('savedTenantChanges', JSON.stringify(tenantChanges));
};

export const removeSavedTenantChanges = () => {
  localStorage.removeItem('savedTenantChanges');
};

export const mergeSavedTenantChanges = (newTenantChanges) => {
  const existing = getSavedTenantChanges();
  const updated = [...existing];

  newTenantChanges.forEach((newTenant) => {
    const existingIndex = updated.findIndex((item) => item.ecri_id === newTenant.ecri_id);
    if (existingIndex >= 0) {
      // Override existing with new data
      updated[existingIndex] = { ...newTenant, saved_at: new Date().toISOString() };
    } else {
      // Add new tenant
      updated.push({ ...newTenant, saved_at: new Date().toISOString() });
    }
  });

  setSavedTenantChanges(updated);
  return updated;
};

export const removeSavedTenantChangesByIds = (tenantIds) => {
  const existing = getSavedTenantChanges();
  const filtered = existing.filter((item) => !tenantIds.includes(item.ecri_id));
  setSavedTenantChanges(filtered);
  return filtered;
};
