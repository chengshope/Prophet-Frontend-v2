// Configuration and utility functions

export const STRATEGY_OPTIONS = [
  { label: 'Mirror Competitors', value: 'mirror' },
  { label: 'Maverick', value: 'maverick' },
  { label: 'Happy Medium', value: 'happy_medium' },
  { label: 'Maverick+', value: 'maverick_plus' },
];

export const VALUE_PRICING_OPTIONS = [
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
  { label: 'Multiple', value: 'multiple' },
];

export const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly'];
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
export const CADENCE_OPTIONS = ['Scheduled', 'Manual'];

export const getBearerToken = (token) => `Bearer ${token}`;

export const MOVE_OUT_PROBABILITY_COLORS = {
  '0-8': '#bbf7d0',
  '8-14': '#EDF4A2',
  'above-14': '#FFD7BA',
};

export const getMoveOutProbabilityColor = (probability) => {
  if (probability >= 8 && probability < 14) {
    return MOVE_OUT_PROBABILITY_COLORS['8-14'];
  }
  if (probability >= 14) {
    return MOVE_OUT_PROBABILITY_COLORS['above-14'];
  }
  return MOVE_OUT_PROBABILITY_COLORS['0-8'];
};

export const convertToNumber = (value) => (!value ? null : Number(value));
export const convertPercentageToDecimal = (value) => (!value ? null : convertToNumber(value) / 100);
export const convertDecimalToPercentage = (value) => (!value ? null : convertToNumber(value) * 100);

export const hasDuplicates = (array) => new Set(array).size !== array.length;
