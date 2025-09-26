export const convertPercentageToDecimal = (value) => {
  if (value === null || value === undefined) return null;
  const decimal = value / 100;
  return Math.round(decimal * 100) / 100; // round to 2 decimals
};

export const convertDecimalToPercentage = (value) => {
  if (value === null || value === undefined) return null;
  const percent = value * 100;
  return Math.round(percent * 100) / 100; // round to 2 decimals
};

export const convertToNumber = (value) => {
  return value ? Number(value) : null;
};

export const getDayOfWeekNumber = (weekdayString) => {
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const index = WEEKDAYS.indexOf(weekdayString);
  return index >= 0 ? index : 0;
};
