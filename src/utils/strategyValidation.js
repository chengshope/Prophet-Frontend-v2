import { STRATEGY_OPTIONS } from './config';

export const isValidStrategy = (strategyValue) => {
  if (!strategyValue || typeof strategyValue !== 'string') {
    return false;
  }

  return STRATEGY_OPTIONS.some((option) => option.value === strategyValue);
};

export const getStrategyLabel = (strategyValue) => {
  if (!strategyValue) return 'Not set';

  const option = STRATEGY_OPTIONS.find((opt) => opt.value === strategyValue);
  return option ? option.label : strategyValue;
};

export const validateStrategy = (strategyValue, options = {}) => {
  const { allowNull = true, logWarnings = true } = options;

  // Handle null/undefined cases
  if (!strategyValue) {
    return allowNull ? null : undefined;
  }

  // Validate the strategy value
  if (isValidStrategy(strategyValue)) {
    return strategyValue;
  }

  // Log warning for invalid strategy
  if (logWarnings) {
    console.warn(
      `Invalid strategy value: "${strategyValue}". Valid options:`,
      STRATEGY_OPTIONS.map((opt) => opt.value)
    );
  }

  return allowNull ? null : undefined;
};

export const createValidatedStrategySetter = (setterFunction, options = {}) => {
  return (strategyValue) => {
    const validatedValue = validateStrategy(strategyValue, options);
    setterFunction(validatedValue);
  };
};

export const getValidStrategyValues = () => {
  return STRATEGY_OPTIONS.map((option) => option.value);
};

export const getStrategyOptions = () => {
  return [...STRATEGY_OPTIONS];
};
