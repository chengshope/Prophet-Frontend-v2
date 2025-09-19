/**
 * Strategy Validation Utilities
 * Provides validation functions for street_rate_strategy values
 */

import { STRATEGY_OPTIONS } from './config';

/**
 * Validates if a strategy value is valid according to STRATEGY_OPTIONS
 * @param {string} strategyValue - The strategy value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidStrategy = (strategyValue) => {
  if (!strategyValue || typeof strategyValue !== 'string') {
    return false;
  }

  return STRATEGY_OPTIONS.some((option) => option.value === strategyValue);
};

/**
 * Gets the strategy label for a given strategy value
 * @param {string} strategyValue - The strategy value
 * @returns {string} - The human-readable label or the original value if not found
 */
export const getStrategyLabel = (strategyValue) => {
  if (!strategyValue) return 'Not set';

  const option = STRATEGY_OPTIONS.find((opt) => opt.value === strategyValue);
  return option ? option.label : strategyValue;
};

/**
 * Validates and sanitizes a strategy value
 * @param {string} strategyValue - The strategy value to validate
 * @param {Object} options - Options for validation
 * @param {boolean} options.allowNull - Whether to allow null/undefined values (default: true)
 * @param {boolean} options.logWarnings - Whether to log warnings for invalid values (default: true)
 * @returns {string|null} - The validated strategy value or null if invalid
 */
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

/**
 * Creates a validated strategy setter function
 * @param {Function} setterFunction - The state setter function
 * @param {Object} options - Options for validation
 * @returns {Function} - A validated setter function
 */
export const createValidatedStrategySetter = (setterFunction, options = {}) => {
  return (strategyValue) => {
    const validatedValue = validateStrategy(strategyValue, options);
    setterFunction(validatedValue);
  };
};

/**
 * Gets all valid strategy values
 * @returns {string[]} - Array of valid strategy values
 */
export const getValidStrategyValues = () => {
  return STRATEGY_OPTIONS.map((option) => option.value);
};

/**
 * Gets all strategy options (value and label pairs)
 * @returns {Array<{value: string, label: string}>} - Array of strategy options
 */
export const getStrategyOptions = () => {
  return [...STRATEGY_OPTIONS];
};
