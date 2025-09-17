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
