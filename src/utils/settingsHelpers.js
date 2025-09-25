import { convertPercentageToDecimal, convertToNumber } from './dataConverters';

/**
 * Prepare ECRI settings for API submission
 * @param {Object} values - Form values
 * @param {string} scope - 'portfolio' or 'facility'
 * @returns {Object} Prepared ECRI settings
 */
export const prepareEcriSettings = (values, scope) => ({
  averagePercentIncrease: convertPercentageToDecimal(values.averagePercentIncrease),
  maxDollarIncrease: convertToNumber(values.maxDollarIncrease),
  minDollarIncrease: convertToNumber(values.minDollarIncrease),
  maxPercentIncrease: convertPercentageToDecimal(values.maxPercentIncrease),
  minPercentIncrease: convertPercentageToDecimal(values.minPercentIncrease),
  storeOccupancyThreshold: convertPercentageToDecimal(values.storeOccupancyThreshold),
  timeSinceLastIncrease: convertToNumber(values.timeSinceLastIncrease),
  timeSinceMoveIn: convertToNumber(values.timeSinceMoveIn),
  limitAboveStreetRate: convertToNumber(values.limitAboveStreetRate),
  percentAboveStreetRate: convertPercentageToDecimal(values.percentAboveStreetRate),
  maxMoveOutProbability: convertPercentageToDecimal(values.maxMoveOutProbability),
  ...(scope === 'portfolio' && { notificationDays: convertToNumber(values.notificationDays) }),
});

/**
 * Prepare street rate settings for API submission
 * @param {Object} values - Form values
 * @returns {Object} Prepared street rate settings
 */
export const prepareStreetRateSettings = (values) => ({
  web_rate: values.web_rate,
  street_rate: values.street_rate,
  override_portfolio_rate_setting: values.overridePortfolio,
});

/**
 * Prepare cron job settings for API submission
 * @param {Object} values - Form values
 * @param {Function} getDayOfWeekNumber - Function to get day of week number
 * @returns {Object} Prepared cron job settings
 */
export const prepareCronJobSettings = (values, getDayOfWeekNumber) => ({
  frequency: values.frequency,
  day_of_week: getDayOfWeekNumber(values.weekday),
  day_of_month: values.dayOfMonth,
  time_of_day: values.timeOfDay ? values.timeOfDay.format('HH:mm') : '00:00',
  emails: values.emails || [],
});
