import { Form, Segmented } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';
import { showError, showSuccess } from '@/utils/messageService';
import {
  useSavePortfolioStrategiesMutation,
  useSaveFacilityStrategiesMutation,
  useSavePortfolioValuePricingMutation,
  useSaveFacilityValuePricingMutation,
} from '@/api/settingsApi';
import {
  STRATEGY_OPTIONS,
  VALUE_PRICING_OPTIONS,
  PORTFOLIO_STRATEGY_OPTIONS,
  PORTFOLIO_VALUE_PRICING_OPTIONS,
} from '@/constants';

const StreetRateStrategy = ({
  scope,
  customerId,
  facilityId,
  currentValuePricing,
  setCurrentValuePricing,
}) => {
  // RTK mutations with loading states
  const [savePortfolioStrategies, { isLoading: portfolioStrategySaving }] = useSavePortfolioStrategiesMutation();
  const [saveFacilityStrategies, { isLoading: facilityStrategySaving }] = useSaveFacilityStrategiesMutation();
  const [savePortfolioValuePricing, { isLoading: portfolioValuePricingSaving }] = useSavePortfolioValuePricingMutation();
  const [saveFacilityValuePricing, { isLoading: facilityValuePricingSaving }] = useSaveFacilityValuePricingMutation();

  // Combined loading states
  const isStrategySaving = scope === 'portfolio' ? portfolioStrategySaving : facilityStrategySaving;
  const isValuePricingSaving = scope === 'portfolio' ? portfolioValuePricingSaving : facilityValuePricingSaving;

  // Handle strategy changes (immediate save like v1)
  const handleStrategyChange = async (strategyValue) => {
    try {
      if (scope === 'portfolio') {
        await savePortfolioStrategies({ customerId, strategyValue }).unwrap();
      } else {
        await saveFacilityStrategies({ facilityId, strategyValue }).unwrap();
      }
      showSuccess('Strategy updated successfully!');
    } catch (error) {
      console.error('Strategy update error:', error);
      showError('Failed to update strategy');
    }
  };

  // Handle value pricing changes (immediate save like v1)
  const handleValuePricingChange = async (valuePricingValue) => {
    try {
      if (scope === 'portfolio') {
        await savePortfolioValuePricing({
          customerId,
          valuePricing: valuePricingValue,
        }).unwrap();
      } else {
        await saveFacilityValuePricing({ facilityId, valuePricing: valuePricingValue }).unwrap();
      }

      // Update local state immediately for UI feedback
      setCurrentValuePricing(valuePricingValue);
      showSuccess('Value pricing updated successfully!');
    } catch (error) {
      console.error('Value pricing update error:', error);
      showError('Failed to update value pricing');
    }
  };

  return (
    <SettingGroup
      title="Street Rate Strategy"
      description="Configure your street rate strategy and value pricing settings."
      loading={isStrategySaving || isValuePricingSaving}
    >
      <Form.Item
        label={
          <FormLabel
            icon={<BulbOutlined />}
            label="Street Rate Strategy"
            tooltip="Your selection will apply to all facilities."
            iconColor="#fa8c16"
          />
        }
        name="street_rate_strategy"
      >
        <Segmented
          size="middle"
          options={scope === 'portfolio' ? PORTFOLIO_STRATEGY_OPTIONS : STRATEGY_OPTIONS}
          onChange={handleStrategyChange}
          disabled={isStrategySaving}
          loading={isStrategySaving}
        />
      </Form.Item>

      <Form.Item
        label={
          <FormLabel
            icon={<BulbOutlined />}
            label="Value Pricing"
            tooltip="Enable tiered pricing. Note: Your website must support this functionality."
            iconColor="#fa8c16"
          />
        }
        name="value_pricing"
        style={{ marginBottom: 0 }}
      >
        <Segmented
          size="middle"
          value={currentValuePricing}
          options={scope === 'portfolio' ? PORTFOLIO_VALUE_PRICING_OPTIONS : VALUE_PRICING_OPTIONS}
          onChange={handleValuePricingChange}
          disabled={currentValuePricing === 'multiple' || isValuePricingSaving}
          loading={isValuePricingSaving}
        />
      </Form.Item>
    </SettingGroup>
  );
};

export default StreetRateStrategy;
