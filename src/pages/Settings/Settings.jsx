import PageFrame from '@/components/common/PageFrame';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';
import { showError, showSuccess } from '@/utils/messageService';
import {
  SaveOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined,
  SoundOutlined,
  MailOutlined,
  PercentageOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  Row,
  Segmented,
  Select,
  Switch,
  TimePicker,
  Upload,
  Spin,
  Space,
  Flex,
} from 'antd';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
import { selectPortfolioId, selectCustomerId } from '@/features/auth/authSelector';
import {
  useGetPortfolioSettingsQuery,
  useUpdatePortfolioSettingsMutation,
  useGetFacilitySettingsQuery,
  useUpdateFacilitySettingsMutation,
  useUpdatePortfolioEcriSettingsMutation,
  useUpdateFacilityEcriSettingsMutation,
  useUploadUnitRankingMutation,
  useLazyDownloadSampleXLSXQuery,
  useLazyExportUnitRankingQuery,
  useGetFacilitiesListQuery,
  useGetCronJobSettingsQuery,
  useUpdateCronJobSettingsMutation,
  useGetPortfolioStrategiesQuery,
  useSavePortfolioStrategiesMutation,
  useSaveFacilityStrategiesMutation,
  useSavePortfolioValuePricingMutation,
  useSaveFacilityValuePricingMutation,
  useToggleFacilityProfileMutation,
  useToggleFacilityStatusMutation,
} from '@/api/settingsApi';
import './Settings.less';
const { Option } = Select;

// Constants for strategy and value pricing options
const STRATEGY_OPTIONS = [
  { label: 'Mirror Competitors', value: 'mirror' },
  { label: 'Maverick', value: 'maverick' },
  { label: 'Happy Medium', value: 'happy_medium' },
  { label: 'Maverick+', value: 'maverick_plus' },
];

const PORTFOLIO_STRATEGY_OPTIONS = [...STRATEGY_OPTIONS, { label: 'Multiple', value: 'multiple' }];

const VALUE_PRICING_OPTIONS = [
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
];

const PORTFOLIO_VALUE_PRICING_OPTIONS = [
  ...VALUE_PRICING_OPTIONS,
  { label: 'Multiple', value: 'multiple' },
];

const WEEKDAY_OPTIONS = [
  { label: 'Mon', value: 'Mon' },
  { label: 'Tue', value: 'Tue' },
  { label: 'Wed', value: 'Wed' },
  { label: 'Thu', value: 'Thu' },
  { label: 'Fri', value: 'Fri' },
  { label: 'Sat', value: 'Sat' },
  { label: 'Sun', value: 'Sun' },
];

// WEEKDAYS array for day_of_week conversion (matching v1)
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly'];

// Day of week mapping - if backend expects different numbering, adjust this
// Current v1 logic: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
// If backend expects: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
// Then we need to adjust the mapping accordingly
const getDayOfWeekNumber = (weekdayString) => {
  const index = WEEKDAYS.indexOf(weekdayString);
  // For now, using v1 logic. If backend expects different mapping,
  // we can adjust this function
  return index >= 0 ? index : 0;
};

const Settings = () => {
  const { id: facilityId } = useParams();
  const navigate = useNavigate();
  const [scope, setScope] = useState(facilityId ? 'facility' : 'portfolio');
  const [form] = Form.useForm();
  const [frequency, setFrequency] = useState('Daily');

  const [currentStrategy, setCurrentStrategy] = useState('happy_medium');
  const [currentValuePricing, setCurrentValuePricing] = useState('off');

  // Get user data from Redux
  const portfolioId = useSelector(selectPortfolioId);
  const customerId = useSelector(selectCustomerId);

  // API hooks
  const { data: facilitiesList, isLoading: facilitiesLoading } = useGetFacilitiesListQuery();

  // Portfolio strategies - get strategies for all facilities in portfolio
  // API Call: GET /api/facility_profile/{customerId}/strategies
  // Response: Array of { id, facility_id, street_rate_strategy }
  const { data: portfolioStrategies, isLoading: strategiesLoading } =
    useGetPortfolioStrategiesQuery(customerId, {
      skip: !customerId,
    });

  // Cron job settings
  const { data: cronJobSettings, isLoading: cronJobLoading } = useGetCronJobSettingsQuery(
    customerId,
    {
      skip: !customerId || scope !== 'portfolio',
    }
  );

  // Note: Portfolio strategies and value pricing are now retrieved from facilitiesList
  // instead of separate API calls, as the facilities data contains these fields directly

  // Portfolio data
  const { data: portfolioSettings, isLoading: portfolioLoading } = useGetPortfolioSettingsQuery(
    portfolioId,
    {
      skip: !portfolioId || scope !== 'portfolio',
    }
  );

  // Facility data
  const { data: facilitySettings, isLoading: facilityLoading } = useGetFacilitySettingsQuery(
    facilityId,
    {
      skip: !facilityId || scope !== 'facility',
    }
  );

  // Mutations
  const [updatePortfolioSettings] = useUpdatePortfolioSettingsMutation();
  const [updateFacilitySettings] = useUpdateFacilitySettingsMutation();
  const [updatePortfolioEcri] = useUpdatePortfolioEcriSettingsMutation();
  const [updateFacilityEcri] = useUpdateFacilityEcriSettingsMutation();
  const [uploadUnitRanking] = useUploadUnitRankingMutation();
  const [downloadSampleXLSX] = useLazyDownloadSampleXLSXQuery();
  const [exportUnitRanking] = useLazyExportUnitRankingQuery();

  // New API mutations
  const [updateCronJobSettings] = useUpdateCronJobSettingsMutation();
  const [savePortfolioStrategies] = useSavePortfolioStrategiesMutation();
  const [saveFacilityStrategies] = useSaveFacilityStrategiesMutation();
  const [savePortfolioValuePricing] = useSavePortfolioValuePricingMutation();
  const [saveFacilityValuePricing] = useSaveFacilityValuePricingMutation();
  const [toggleFacilityProfile] = useToggleFacilityProfileMutation();
  const [toggleFacilityStatus] = useToggleFacilityStatusMutation();

  // Combined loading state
  const isLoading =
    scope === 'portfolio'
      ? portfolioLoading || facilitiesLoading || cronJobLoading || strategiesLoading
      : facilityLoading;

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
      });
    }
  }, [portfolioSettings, facilitySettings, cronJobSettings, scope, form]);

  // Update current strategy and value pricing when data changes
  useEffect(() => {
    const strategyValue = getStrategyValue();
    const valuePricingValue = getValuePricingValue();

    setCurrentStrategy(strategyValue);
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

  // Helper functions for data transformation (matching v1 logic)
  const convertPercentageToDecimal = (value) => {
    return value ? value / 100 : null;
  };

  const convertDecimalToPercentage = (value) => {
    return value ? value * 100 : null;
  };

  const convertToNumber = (value) => {
    return value ? Number(value) : null;
  };

  // Helper function to prepare ECRI settings (reduces duplication)
  const prepareEcriSettings = (values) => ({
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
    const ecriSettings = prepareEcriSettings(values);

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
    const ecriSettings = prepareEcriSettings(values);

    // Prepare street rate settings
    const streetRateSettings = {
      web_rate: values.web_rate,
      street_rate: values.street_rate,
      override_portfolio_rate_setting: values.overridePortfolio,
    };

    // Save ECRI settings using helper function
    await saveEcriSettings(ecriSettings);

    // Save facility settings
    await updateFacilitySettings({
      facilityId,
      street_rate_settings: streetRateSettings,
    }).unwrap();
  };

  const handleStrategyChange = async (strategyValue) => {
    try {
      if (scope === 'portfolio') {
        await savePortfolioStrategies({ customerId, strategyValue }).unwrap();
      } else {
        await saveFacilityStrategies({ facilityId, strategyValue }).unwrap();
      }

      setCurrentStrategy(strategyValue);
      showSuccess('Strategy updated successfully!');
    } catch (error) {
      console.error('Strategy update error:', error);
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

  // Handle profile toggle (immediate save like v1)
  const handleProfileToggle = async () => {
    if (!facilityId) {
      showError('No facility selected');
      return;
    }

    try {
      await toggleFacilityProfile(facilityId).unwrap();
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      showError('Failed to update profile');
    }
  };

  // Handle status toggle (immediate save like v1)
  const handleStatusToggle = async () => {
    if (!facilityId) {
      showError('No facility selected');
      return;
    }

    try {
      await toggleFacilityStatus(facilityId).unwrap();
      showSuccess('Status updated successfully!');
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  // Handle file operations
  const handleUnitRankingUpload = async (file) => {
    const { facility_id } = facilitySettings;
    if (!facility_id) {
      showError('No facility selected');
      return;
    }
    try {
      await uploadUnitRanking({ facilityId: facility_id, file }).unwrap();
      showSuccess('Unit ranking uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload unit ranking');
    }
  };

  const handleDownloadSample = async () => {
    const { facility_id } = facilitySettings;

    if (!facility_id) {
      showError('No facility selected');
      return;
    }
    try {
      const result = await downloadSampleXLSX(facility_id).unwrap();
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'unit_ranking_sample.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download sample');
    }
  };

  const handleExportRanking = async () => {
    const { facility_id } = facilitySettings;

    if (!facility_id) {
      showError('No facility selected');
      return;
    }
    try {
      const result = await exportUnitRanking(facility_id).unwrap();
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'unit_ranking_export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export unit ranking');
    }
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
            initialValues={{
              frequency: 'Daily',
              weekday: 'Mon',
              dayOfMonth: 1,
              overridePortfolio: false,
              web_rate: false,
              street_rate: true,
              rate_hold_on_occupancy: false,
            }}
          >
            <Flex vertical gap={16}>
              {scope === 'facility' && (
                <>
                  <SettingGroup title="Status" description="Enable or disable this facility.">
                    <Form.Item name="status" style={{ marginBottom: 0 }}>
                      <Segmented
                        size="middle"
                        value={facilitySettings?.status || 'enabled'}
                        options={[
                          { label: 'Enabled', value: 'enabled' },
                          { label: 'Disabled', value: 'disabled' },
                        ]}
                        onChange={handleStatusToggle}
                      />
                    </Form.Item>
                  </SettingGroup>
                  <SettingGroup title="Profile" description="Select the facility profile type.">
                    <Form.Item name="profile" style={{ marginBottom: 0 }}>
                      <Segmented
                        size="middle"
                        value={facilitySettings?.profile || 'stabilized'}
                        options={[
                          { label: 'Stabilized', value: 'stabilized' },
                          { label: 'Lease Up', value: 'leaseup' },
                        ]}
                        onChange={handleProfileToggle}
                      />
                    </Form.Item>
                  </SettingGroup>
                </>
              )}

              <SettingGroup
                title="Street Rate Strategy"
                description="Configure your street rate strategy and value pricing settings."
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
                    options={
                      scope === 'portfolio'
                        ? PORTFOLIO_VALUE_PRICING_OPTIONS
                        : VALUE_PRICING_OPTIONS
                    }
                    onChange={handleValuePricingChange}
                  />
                </Form.Item>
              </SettingGroup>

              {/* Unit Ranking Upload - only show for facility scope */}
              {scope === 'facility' && (
                <SettingGroup
                  title="Unit Ranking Upload"
                  description="Upload unit ranking data for this facility."
                >
                  <Form.Item
                    label={
                      <FormLabel
                        icon={<BulbOutlined />}
                        label="Unit Ranking Upload"
                        tooltip="Unit Ranking Upload."
                        iconColor="#fa8c16"
                      />
                    }
                    style={{ marginBottom: 0 }}
                  >
                    <Space wrap>
                      <Upload
                        accept=".xlsx"
                        showUploadList={false}
                        beforeUpload={(file) => {
                          handleUnitRankingUpload(file);
                          return false;
                        }}
                      >
                        <Button icon={<UploadOutlined />} style={{ width: '100%' }} block>
                          Click Here To Upload Your Unit Ranking
                        </Button>
                      </Upload>
                      <Button icon={<DownloadOutlined />} onClick={handleExportRanking}>
                        Click Here To Export Unit Ranking
                      </Button>
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadSample}
                      >
                        Download Sample XLSX
                      </Button>
                    </Space>
                  </Form.Item>
                </SettingGroup>
              )}

              {/* Street Rate Update Strategy - only show for portfolio scope */}
              {scope === 'portfolio' && (
                <SettingGroup
                  title="Street Rate Update Strategy"
                  description="Configure when and how street rates should be updated."
                >
                  <Form.Item
                    label={
                      <FormLabel
                        icon={<SoundOutlined />}
                        label="Frequency"
                        iconColor="#fa8c16"
                      />
                    }
                    name="frequency"
                  >
                    <Segmented
                      size="middle"
                      value={frequency}
                      onChange={handleFrequencyChange}
                      options={[
                        { label: 'Daily', value: 'Daily' },
                        { label: 'Weekly', value: 'Weekly' },
                        { label: 'Monthly', value: 'Monthly' },
                      ]}
                    />
                  </Form.Item>

                  {/* Day of Week - only show for Weekly frequency */}
                  {frequency === 'Weekly' && (
                    <Form.Item
                      label={
                        <FormLabel
                          icon={<BulbOutlined />}
                          label="Day of Week"
                          iconColor="#fa8c16"
                        />
                      }
                      name="weekday"
                    >
                      <Segmented size="middle" options={WEEKDAY_OPTIONS} />
                    </Form.Item>
                  )}

                  {/* Day of Month - only show for Monthly frequency */}
                  {frequency === 'Monthly' && (
                    <Form.Item
                      label={
                        <FormLabel
                          icon={<BulbOutlined />}
                          label="Day of Month"
                          iconColor="#fa8c16"
                        />
                      }
                      name="dayOfMonth"
                    >
                      <Select size="middle">
                        {Array.from({ length: 31 }, (_, i) => (
                          <Option key={i + 1} value={i + 1}>
                            {i + 1}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}

                  <Form.Item
                    label={
                      <FormLabel
                        icon={<ClockCircleOutlined />}
                        label="Time of Day"
                        tooltip="Set the time when updates should be executed."
                        iconColor="#fa8c16"
                      />
                    }
                    name="timeOfDay"
                    className="full-width-picker"
                  >
                    <TimePicker format="HH:mm" size="middle" style={{ width: 300 }}/>
                  </Form.Item>

                  <Form.Item
                    label={
                      <FormLabel
                        icon={<MailOutlined />}
                        label="Notification Emails"
                        tooltip="Hit ENTER to add a new email."
                        iconColor="#fa8c16"
                      />
                    }
                    name="emails"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      size="middle"
                      mode="tags"
                      tokenSeparators={[',']}
                      placeholder="Add email and press Enter"
                    />
                  </Form.Item>
                </SettingGroup>
              )}

              <SettingGroup
                title="Rates To Update"
                description="Configure which rates should be updated automatically."
              >
                {/* Facility-specific fields */}
                {scope === 'facility' && (
                  <>
                    <Form.Item
                      name="overridePortfolio"
                      valuePropName="checked"
                      label="Override Portfolio Rate Setting"
                    >
                      <Switch />
                    </Form.Item>
                  </>
                )}

                {scope === 'portfolio' && (
                  <Form.Item
                    name="rate_hold_on_occupancy"
                    valuePropName="checked"
                    label="Do not decrease rates on fully occupied types"
                  >
                    <Switch />
                  </Form.Item>
                )}

                <Form.Item name="web_rate" valuePropName="checked" label="Web Rate">
                  <Switch />
                </Form.Item>

                <Form.Item name="street_rate" valuePropName="checked" label="Street Rate" style={{ marginBottom: 0 }}>
                  <Switch />
                </Form.Item>

              </SettingGroup>

              <SettingGroup
                title="Revenue Goal"
                description="Set the target average percent increase for revenue optimization."
              >

                <Form.Item
                  label={
                    <FormLabel
                      icon={<PercentageOutlined />}
                      label="Average Percent Increase"
                      tooltip="Average rate increase percentage for eligible tenants. Recommended range: 5-25%"
                      iconColor="#52c41a"
                    />
                  }
                  name="averagePercentIncrease"
                  className="full-width-number"
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
                </Form.Item>

              </SettingGroup>

              <SettingGroup
                title="Rate Increase Criteria"
                description="Configure the criteria and limits for automatic rate increases."
              >

                {scope === 'portfolio' && (

                  <Form.Item
                    label={
                      <FormLabel
                        icon={<ClockCircleOutlined />}
                        label="Notification Days"
                        tooltip="Number of days before rate change that notice is sent to customer"
                        iconColor="#fa8c16"
                      />
                    }
                    name="notificationDays"
                    className="full-width-number"
                  >
                    <InputNumber min={0} style={{ width: 300 }} />
                  </Form.Item>

                )}

                <Form.Item
                  label={
                    <FormLabel
                      icon={<DollarOutlined />}
                      label="Max Dollar Increase"
                      tooltip="The maximum incremental dollar increase any one tenant may receive."
                      iconColor="#52c41a"
                    />
                  }
                  name="maxDollarIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} addonBefore="$" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<DollarOutlined />}
                      label="Min Dollar Increase"
                      tooltip="The minimum incremental dollar increase any one tenant may receive."
                      iconColor="#52c41a"
                    />
                  }
                  name="minDollarIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} addonBefore="$" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<PercentageOutlined />}
                      label="Max Percent Increase"
                      tooltip="The maximum percentage increase any one tenant may receive."
                      iconColor="#52c41a"
                    />
                  }
                  name="maxPercentIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<PercentageOutlined />}
                      label="Min Percent Increase"
                      tooltip="The minimum percentage increase any one tenant may receive."
                      iconColor="#52c41a"
                    />
                  }
                  name="minPercentIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<PercentageOutlined />}
                      label="Store Occupancy Threshold"
                      tooltip="The minimum occupancy required for any given facility to qualify for tenant rate increases."
                      iconColor="#52c41a"
                    />
                  }
                  name="storeOccupancyThreshold"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<ClockCircleOutlined />}
                      label="Time Since Last Increase (months)"
                      tooltip="The minimum time in months since a tenant's last rate increase."
                      iconColor="#fa8c16"
                    />
                  }
                  name="timeSinceLastIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<ClockCircleOutlined />}
                      label="Time Since Move-in (months)"
                      tooltip="The minimum time in months since a tenant's move-in date."
                      iconColor="#fa8c16"
                    />
                  }
                  name="timeSinceMoveIn"
                  className="full-width-number"
                >
                  <InputNumber min={0} style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<DollarOutlined />}
                      label="Limit Above Street Rate ($)"
                      tooltip="The absolute dollar value over the unit street rate a tenant is occupying."
                    />
                  }
                  name="limitAboveStreetRate"
                  className="full-width-number"
                >
                  <InputNumber min={0} addonBefore="$" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<PercentageOutlined />}
                      label="Limit Above Street Rate (%)"
                      tooltip="The percentage over the unit street rate a tenant is occupying."
                    />
                  }
                  name="percentAboveStreetRate"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
                </Form.Item>

                <Form.Item
                  label={
                    <FormLabel
                      icon={<PercentageOutlined />}
                      label="Max Move-Out Probability"
                      tooltip="The desired upper threshold for any given tenant's move-out probability."
                      iconColor="#52c41a"
                    />
                  }
                  name="maxMoveOutProbability"
                  className="full-width-number"
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: 300 }} />
                </Form.Item>

              </SettingGroup>
              <Flex justify="flex-end">
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    icon={<SaveOutlined />}
                    style={{ width: 200 }}
                  >
                    Save
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
