import PageFrame from '@/components/common/PageFrame';
import { showError, showSuccess } from '@/utils/messageService';
// Split components
import FacilityStatus from '@/components/widgets/Settings/FacilityStatus';
import FacilityProfile from '@/components/widgets/Settings/FacilityProfile';
import StreetRateStrategy from '@/components/widgets/Settings/StreetRateStrategy';
import UnitRankingUpload from '@/components/widgets/Settings/UnitRankingUpload';
import StreetRateUpdateStrategy from '@/components/widgets/Settings/StreetRateUpdateStrategy';
import RatesToUpdate from '@/components/widgets/Settings/RatesToUpdate';
import RevenueGoal from '@/components/widgets/Settings/RevenueGoal';
import RateIncreaseCriteria from '@/components/widgets/Settings/RateIncreaseCriteria';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Select, Spin, Flex } from 'antd';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { selectPortfolioId, selectCustomerId } from '@/features/auth/authSelector';
import { WEEKDAYS, FREQUENCY_OPTIONS, SETTINGS_INITIAL_VALUES } from '@/constants';
import {
  convertPercentageToDecimal,
  convertDecimalToPercentage,
  convertToNumber,
  getDayOfWeekNumber
} from '@/utils/dataConverters';
import {
  prepareEcriSettings,
  prepareStreetRateSettings,
  prepareCronJobSettings
} from '@/utils/settingsHelpers';
import {
  useGetPortfolioSettingsQuery,
  useUpdatePortfolioSettingsMutation,
  useGetFacilitySettingsQuery,
  useUpdateFacilitySettingsMutation,
  useUpdatePortfolioEcriSettingsMutation,
  useUpdateFacilityEcriSettingsMutation,
  useGetFacilitiesListQuery,
  useGetCronJobSettingsQuery,
  useUpdateCronJobSettingsMutation,
  useGetPortfolioStrategiesQuery,
} from '@/api/settingsApi';
import './Settings.less';



const Settings = () => {
  const { id: facilityId } = useParams();
  const navigate = useNavigate();
  const [scope, setScope] = useState(facilityId ? 'facility' : 'portfolio');
  const [form] = Form.useForm();
  const [frequency, setFrequency] = useState('Daily');
  const [currentValuePricing, setCurrentValuePricing] = useState('off');

  const portfolioId = useSelector(selectPortfolioId);
  const customerId = useSelector(selectCustomerId);

  const { data: facilitiesList, isLoading: facilitiesLoading, isFetching: facilitiesFetching, refetch } = useGetFacilitiesListQuery({
    refetchOnMountOrArgChange: true,
  });

  const { data: portfolioStrategies, isLoading: strategiesLoading, isFetching: strategiesFetching } =
    useGetPortfolioStrategiesQuery(customerId, {
      skip: !customerId || scope !== 'portfolio',
      refetchOnMountOrArgChange: true,
    });

  const { data: cronJobSettings, isLoading: cronJobLoading, isFetching: cronJobFetching } = useGetCronJobSettingsQuery(
    customerId,
    {
      skip: !customerId || scope !== 'portfolio',
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: portfolioSettings, isLoading: portfolioLoading, isFetching: portfolioFetching } = useGetPortfolioSettingsQuery(
    portfolioId,
    {
      skip: !portfolioId || scope !== 'portfolio',
      refetchOnMountOrArgChange: true,
    }
  );

  // Facility data
  const { data: facilitySettings, isLoading: facilityLoading, isFetching: facilityFetching } = useGetFacilitySettingsQuery(
    facilityId,
    {
      skip: !facilityId || scope !== 'facility',
      refetchOnMountOrArgChange: true,
    }
  );

  // Mutations with loading states
  const [updatePortfolioSettings, { isLoading: portfolioSettingsUpdating }] = useUpdatePortfolioSettingsMutation();
  const [updateFacilitySettings, { isLoading: facilitySettingsUpdating }] = useUpdateFacilitySettingsMutation();
  const [updatePortfolioEcri, { isLoading: portfolioEcriUpdating }] = useUpdatePortfolioEcriSettingsMutation();
  const [updateFacilityEcri, { isLoading: facilityEcriUpdating }] = useUpdateFacilityEcriSettingsMutation();
  const [updateCronJobSettings, { isLoading: cronJobUpdating }] = useUpdateCronJobSettingsMutation();

  // Combined loading state (including fetching states for refetch operations)
  const isLoading =
    scope === 'portfolio'
      ? portfolioLoading || facilitiesLoading || cronJobLoading || strategiesLoading ||
        portfolioFetching || facilitiesFetching || cronJobFetching || strategiesFetching
      : facilityLoading || facilityFetching;

  // Combined saving state for mutations
  const isSaving =
    scope === 'portfolio'
      ? portfolioSettingsUpdating || portfolioEcriUpdating || cronJobUpdating
      : facilitySettingsUpdating || facilityEcriUpdating;

  // Handle scope change
  const handleScopeChange = (value) => {
    setScope(value);
    form.resetFields();
  };

  // Handle frequency change to show/hide conditional fields
  const handleFrequencyChange = (value) => {
    setFrequency(value);
  };

  // Helper function to determine strategy value
  const getStrategyValue = () => {
    if (scope === 'portfolio' && portfolioStrategies) {
      // Use the portfolio strategies API data
      const strategies = portfolioStrategies.map((s) => s.street_rate_strategy).filter(Boolean);
      const uniqueStrategies = [...new Set(strategies)];
      return uniqueStrategies.length === 1 ? uniqueStrategies[0] : 'multiple';
    } else if (scope === 'facility' && facilitySettings) {
      return facilitySettings.street_rate_strategy || 'happy_medium';
    }
    return 'happy_medium';
  };

  // Helper function to determine value pricing value
  const getValuePricingValue = () => {
    if (scope === 'portfolio' && facilitiesList) {
      const valuePricingValues = facilitiesList.map((f) => f.value_pricing);
      const uniqueValues = [...new Set(valuePricingValues)];
      if (uniqueValues.length === 1) {
        return uniqueValues[0] === null ? 'off' : uniqueValues[0];
      }
      return 'multiple';
    } else if (scope === 'facility' && facilitySettings) {
      return facilitySettings.value_pricing === null
        ? 'off'
        : facilitySettings.value_pricing || 'off';
    }
    return 'off';
  };

  // Load form data when settings change
  useEffect(() => {
    if (scope === 'portfolio' && portfolioSettings) {
      const streetRateSettings = portfolioSettings.street_rate_settings || {};
      const ecriSettings = portfolioSettings.ecri_settings || {};

      // Merge cron job settings if available
      const cronSettings = cronJobSettings || {};

      // Convert cron job data to form format (matching v1 logic)
      let formTimeOfDay = null;
      if (cronSettings.hour && cronSettings.minute) {
        // Convert UTC time back to local time (matching v1 logic)
        let hour = cronSettings.hour;
        let minute = cronSettings.minute;

        // Ensure proper formatting
        if (parseInt(hour) < 10) {
          hour = `0${hour}`;
        }
        if (parseInt(minute) < 10) {
          minute = `0${minute}`;
        }

        let timeOfDay = `${hour}:${minute}`;

        // Get the current UTC time in 'YYYY-MM-DD' format
        const utcDate = dayjs().utc().format('YYYY-MM-DD');
        // Combine today's date with the timeOfDay
        const datetime = dayjs(`${utcDate}T${timeOfDay}:00Z`);
        // Convert UTC datetime to local time
        timeOfDay = dayjs(datetime).format('HH:mm');
        formTimeOfDay = dayjs(timeOfDay, 'HH:mm');
      } else if (streetRateSettings.timeOfDay) {
        formTimeOfDay = dayjs(streetRateSettings.timeOfDay, 'HH:mm');
      }

      // Convert decimal percentage values to display percentages
      const convertedEcriSettings = {
        ...ecriSettings,
        averagePercentIncrease: convertDecimalToPercentage(ecriSettings.averagePercentIncrease),
        maxPercentIncrease: convertDecimalToPercentage(ecriSettings.maxPercentIncrease),
        minPercentIncrease: convertDecimalToPercentage(ecriSettings.minPercentIncrease),
        storeOccupancyThreshold: convertDecimalToPercentage(ecriSettings.storeOccupancyThreshold),
        limitAboveStreetRate: convertToNumber(ecriSettings.limitAboveStreetRate),
        percentAboveStreetRate: convertDecimalToPercentage(ecriSettings.percentAboveStreetRate),
        maxMoveOutProbability: convertDecimalToPercentage(ecriSettings.maxMoveOutProbability),
      };

      form.setFieldsValue({
        ...streetRateSettings,
        ...convertedEcriSettings,
        frequency: cronSettings.frequency || streetRateSettings.frequency || 'Daily',
        weekday:
          cronSettings.day_of_week !== undefined
            ? WEEKDAYS[cronSettings.day_of_week]
            : streetRateSettings.weekday || 'Mon',
        dayOfMonth: cronSettings.day_of_month || streetRateSettings.dayOfMonth || 1,
        timeOfDay: formTimeOfDay,
        emails: cronSettings.emails || streetRateSettings.emails || [],
      });

      setFrequency(cronSettings.frequency || streetRateSettings.frequency || 'Daily');
    } else if (scope === 'facility' && facilitySettings) {
      const streetRateSettings = facilitySettings.street_rate_settings || {};
      const ecriSettings = facilitySettings.ecri_settings || {};

      // Convert decimal percentage values to display percentages
      const convertedEcriSettings = {
        ...ecriSettings,
        averagePercentIncrease: convertDecimalToPercentage(ecriSettings.averagePercentIncrease),
        maxPercentIncrease: convertDecimalToPercentage(ecriSettings.maxPercentIncrease),
        minPercentIncrease: convertDecimalToPercentage(ecriSettings.minPercentIncrease),
        storeOccupancyThreshold: convertDecimalToPercentage(ecriSettings.storeOccupancyThreshold),
        limitAboveStreetRate: convertToNumber(ecriSettings.limitAboveStreetRate),
        percentAboveStreetRate: convertDecimalToPercentage(ecriSettings.percentAboveStreetRate),
        maxMoveOutProbability: convertDecimalToPercentage(ecriSettings.maxMoveOutProbability),
      };

      form.setFieldsValue({
        ...facilitySettings,
        ...streetRateSettings,
        ...convertedEcriSettings,
        profile: facilitySettings.profile || 'stabilized',
        overridePortfolio: streetRateSettings.override_portfolio_rate_setting || false,
      });
    }
  }, [portfolioSettings, facilitySettings, cronJobSettings, scope, form]);

  // Update current strategy and value pricing when data changes
  useEffect(() => {
    const strategyValue = getStrategyValue();
    const valuePricingValue = getValuePricingValue();

    setCurrentValuePricing(valuePricingValue);

    form.setFieldValue('street_rate_strategy', strategyValue);
    form.setFieldValue('value_pricing', valuePricingValue);

    // Log portfolio strategies data for debugging
    if (portfolioStrategies && portfolioStrategies.length > 0) {
      console.log('Portfolio Strategies API Response:', portfolioStrategies);
      console.log('Unique strategies found:', [
        ...new Set(portfolioStrategies.map((s) => s.street_rate_strategy)),
      ]);
    }
  }, [portfolioStrategies, facilitiesList, facilitySettings, scope]);

  // Helper function to save ECRI settings (reduces duplication)
  const saveEcriSettings = async (ecriSettings) => {
    const hasEcriSettings = Object.values(ecriSettings).some(
      (val) => val !== null && val !== undefined && val !== ''
    );
    if (hasEcriSettings) {
      if (scope === 'portfolio') {
        await updatePortfolioEcri({ portfolioId, ecri_settings: ecriSettings }).unwrap();
      } else {
        await updateFacilityEcri({ facilityId, ecri_settings: ecriSettings }).unwrap();
      }
    }
  };

  const handlePortfolioSave = async (values) => {
    // Prepare ECRI settings using helper function
    const ecriSettings = prepareEcriSettings(values, scope);

    // Prepare street rate settings
    const streetRateSettings = {
      web_rate: values.web_rate,
      street_rate: values.street_rate,
      rate_hold_on_occupancy: values.rate_hold_on_occupancy,
      frequency: values.frequency,
      weekday: values.weekday,
      dayOfMonth: values.dayOfMonth,
      timeOfDay:
        values.timeOfDay && values.timeOfDay.format
          ? values.timeOfDay.format('HH:mm')
          : values.timeOfDay,
      emails: values.emails,
    };

    // Save ECRI settings using helper function
    await saveEcriSettings(ecriSettings);

    // Save portfolio settings
    await updatePortfolioSettings({
      portfolioId,
      street_rate_settings: streetRateSettings,
    }).unwrap();

    // Save cron job settings (matching v1 logic exactly)
    if (values.timeOfDay) {
      // Convert day of week using WEEKDAYS array (matching v1)
      const day_of_week = getDayOfWeekNumber(values.weekday);

      const updateParams = {
        customer_id: customerId,
        frequency: values.frequency,
        emails: values.emails || [],
      };

      // Add day_of_week for Weekly frequency (matching v1)
      if (values.frequency === FREQUENCY_OPTIONS[1]) {
        // 'Weekly'
        updateParams.day_of_week = day_of_week;
      }

      // Add day_of_month for Monthly frequency (matching v1)
      if (values.frequency === FREQUENCY_OPTIONS[2]) {
        // 'Monthly'
        updateParams.day_of_month = values.dayOfMonth;
      }

      // Time conversion logic (matching v1 exactly)
      const today = dayjs().format('YYYY-MM-DD');
      const timeString = values.timeOfDay.format
        ? values.timeOfDay.format('HH:mm')
        : values.timeOfDay;

      // Combine today's date with the timeOfDay
      const datetime = dayjs(`${today}T${timeString}`);
      // Convert to UTC and format
      const utcTime = datetime.utc().format('HH:mm');

      const [hour, minute] = utcTime.split(':');
      updateParams.hour = hour;
      updateParams.minute = minute;

      await updateCronJobSettings(updateParams).unwrap();
    }
  };

  const handleFacilitySave = async (values) => {
    // Prepare ECRI settings using helper function
    const ecriSettings = prepareEcriSettings(values, scope);

    // Prepare street rate settings
    const streetRateSettings = prepareStreetRateSettings(values);

    // Save ECRI settings using helper function
    await saveEcriSettings(ecriSettings);

    // Save facility settings
    await updateFacilitySettings({
      facilityId,
      street_rate_settings: streetRateSettings,
    }).unwrap();
  };

  const onFinish = async (values) => {
    try {
      if (scope === 'portfolio') {
        await handlePortfolioSave(values);
      } else {
        await handleFacilitySave(values);
      }
      showSuccess('Settings updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      showError('Failed to update settings');
    }
  };

  return (
    <PageFrame
      title="Settings"
      extra={[
        <Select
          key="scope-select"
          size="middle"
          style={{ width: 250 }}
          value={scope === 'portfolio' ? 'portfolio' : parseInt(facilityId)}
          loading={facilitiesLoading}
          onChange={(value) => {
            if (value === 'portfolio') {
              handleScopeChange('portfolio');
              navigate('/settings');
              refetch();
            } else {
              handleScopeChange('facility');
              navigate(`/settings/${value}`);
            }
          }}
          options={[
            { label: 'Portfolio Settings', value: 'portfolio' },
            ...(facilitiesList || []).map((facility) => ({
              label:
                `${facility.facility_name} - ${facility.city || ''}, ${facility.state || ''}`.replace(
                  / - ,/,
                  ' -'
                ),
              value: facility.id,
            })),
          ]}
        />,
      ]}
    >
      <Card
        title={`${scope === 'portfolio' ? 'Portfolio' : 'Facility'} Settings`}
        className="page-card"
      >
        <Spin spinning={isLoading} tip="Loading settings...">
          <Form
            labelAlign="left"
            colon={false}
            form={form}
            onFinish={onFinish}
            labelCol={{ flex: '320px' }}
            wrapperCol={{ flex: 1 }}
            initialValues={SETTINGS_INITIAL_VALUES}
          >
            <Flex vertical gap={16}>
              {scope === 'facility' && (
                <>
                  <FacilityStatus facilityId={facilityId} />
                  <FacilityProfile facilityId={facilityId} />
                </>
              )}

              <StreetRateStrategy
                scope={scope}
                customerId={customerId}
                facilityId={facilityId}
                currentValuePricing={currentValuePricing}
                setCurrentValuePricing={setCurrentValuePricing}
              />

              {scope === 'facility' && (
                <UnitRankingUpload facilityId={facilityId} facilitySettings={facilitySettings} />
              )}

              {scope === 'portfolio' && (
                <StreetRateUpdateStrategy
                  frequency={frequency}
                  setFrequency={setFrequency}
                  handleFrequencyChange={handleFrequencyChange}
                  form={form}
                  loading={isSaving}
                />
              )}

              <RatesToUpdate scope={scope} loading={isSaving} />

              <RevenueGoal loading={isSaving} />

              <RateIncreaseCriteria scope={scope} loading={isSaving} />
              <Flex justify="flex-end">
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSaving}
                    disabled={isLoading}
                    icon={<SaveOutlined />}
                    style={{ width: 200 }}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </Form.Item>
              </Flex>
            </Flex>
          </Form>
        </Spin>
      </Card>
    </PageFrame>
  );
};

export default Settings;
