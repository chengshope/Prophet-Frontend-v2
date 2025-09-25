// Settings related constants
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly'];

// Strategy options
export const STRATEGY_OPTIONS = [
  { label: 'Mirror Competitors', value: 'mirror' },
  { label: 'Maverick', value: 'maverick' },
  { label: 'Happy Medium', value: 'happy_medium' },
  { label: 'Maverick+', value: 'maverick_plus' },
];

export const PORTFOLIO_STRATEGY_OPTIONS = [
  { label: 'Mirror Competitors', value: 'mirror' },
  { label: 'Maverick', value: 'maverick' },
  { label: 'Happy Medium', value: 'happy_medium' },
  { label: 'Maverick+', value: 'maverick_plus' },
  { label: 'Multiple', value: 'multiple' },
];

// Value pricing options
export const VALUE_PRICING_OPTIONS = [
  { label: 'Off', value: 'off' },
  { label: 'On', value: 'on' },
];

export const PORTFOLIO_VALUE_PRICING_OPTIONS = [
  { label: 'Off', value: 'off' },
  { label: 'On', value: 'on' },
  { label: 'Multiple', value: 'multiple' },
];

// Weekday options for segmented control
export const WEEKDAY_OPTIONS = [
  { label: 'Monday', value: 'Mon' },
  { label: 'Tuesday', value: 'Tue' },
  { label: 'Wednesday', value: 'Wed' },
  { label: 'Thursday', value: 'Thu' },
  { label: 'Friday', value: 'Fri' },
  { label: 'Saturday', value: 'Sat' },
  { label: 'Sunday', value: 'Sun' },
];

// Form initial values
export const SETTINGS_INITIAL_VALUES = {
  frequency: 'Daily',
  weekday: 'Mon',
  dayOfMonth: 1,
  overridePortfolio: false,
  web_rate: false,
  street_rate: false,
  rate_hold_on_occupancy: false,
};
