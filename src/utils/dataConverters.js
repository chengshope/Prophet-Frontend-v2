/**
 * Utility functions for data conversion between different formats
 */

/**
 * Convert percentage value to decimal (e.g., 25 -> 0.25)
 * @param {number|null|undefined} value - The percentage value
 * @returns {number|null} The decimal value or null
 */
export const convertPercentageToDecimal = (value) => {
  if (value === null || value === undefined) return null;
  const decimal = value / 100;
  return Math.round(decimal * 100) / 100; // round to 2 decimals
};

/**
 * Convert decimal value to percentage (e.g., 0.25 -> 25)
 * @param {number|null|undefined} value - The decimal value
 * @returns {number|null} The percentage value or null
 */
export const convertDecimalToPercentage = (value) => {
  if (value === null || value === undefined) return null;
  const percent = value * 100;
  return Math.round(percent * 100) / 100; // round to 2 decimals
};

/**
 * Convert value to number, handling null/undefined cases
 * @param {any} value - The value to convert
 * @returns {number|null} The number value or null
 */
export const convertToNumber = (value) => {
  return value ? Number(value) : null;
};

/**
 * Get day of week number from weekday string
 * @param {string} weekdayString - The weekday string (e.g., 'Mon', 'Tue')
 * @returns {number} The day of week number (0-6)
 */
export const getDayOfWeekNumber = (weekdayString) => {
  const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const index = WEEKDAYS.indexOf(weekdayString);
  return index >= 0 ? index : 0;
};
