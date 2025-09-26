import { convertPercentageToDecimal, convertToNumber } from './dataConverters';

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

export const prepareStreetRateSettings = (values) => ({
  web_rate: values.web_rate,
  street_rate: values.street_rate,
  override_portfolio_rate_setting: values.overridePortfolio,
});

export const prepareCronJobSettings = (values, getDayOfWeekNumber) => ({
  frequency: values.frequency,
  day_of_week: getDayOfWeekNumber(values.weekday),
  day_of_month: values.dayOfMonth,
  time_of_day: values.timeOfDay ? values.timeOfDay.format('HH:mm') : '00:00',
  emails: values.emails || [],
});
