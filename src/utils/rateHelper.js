export function getRateType(facility, portfolioSettings) {
  const facilitySetting = facility?.street_rate_settings;
  const portfolioSetting = portfolioSettings?.street_rate_settings;

  // If facility has override
  if (facilitySetting?.override_portfolio_rate_setting) {
    return facilitySetting.street_rate ? 'street_rate' : 'web_rate';
  }

  // Fallback to portfolio settings
  if (portfolioSetting) {
    return portfolioSetting.street_rate ? 'street_rate' : 'web_rate';
  }

  // Default
  return 'street_rate';
}
