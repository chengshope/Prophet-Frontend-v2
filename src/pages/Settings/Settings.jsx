import PageFrame from '@/components/common/PageFrame';
import { showError, showSuccess } from '@/utils/messageService';
import {
  SaveOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Row,
  Segmented,
  Select,
  Switch,
  TimePicker,
  Tooltip,
  Upload,
  Spin,
  Space,
} from 'antd';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
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

const PORTFOLIO_STRATEGY_OPTIONS = [
  ...STRATEGY_OPTIONS,
  { label: 'Multiple', value: 'multiple' },
];

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
      ? portfolioLoading || facilitiesLoading || cronJobLoading
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
    if (scope === 'portfolio' && facilitiesList) {
      const strategies = facilitiesList.map((f) => f.street_rate_strategy).filter(Boolean);
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

      form.setFieldsValue({
        ...streetRateSettings,
        ...ecriSettings,
        frequency: cronSettings.frequency || streetRateSettings.frequency || 'Daily',
        weekday: cronSettings.day_of_week || streetRateSettings.weekday || 'Mon',
        dayOfMonth: cronSettings.day_of_month || streetRateSettings.dayOfMonth || 1,
        timeOfDay:
          cronSettings.hour && cronSettings.minute
            ? dayjs(
                `${String(cronSettings.hour).padStart(2, '0')}:${String(cronSettings.minute).padStart(2, '0')}`,
                'HH:mm'
              )
            : streetRateSettings.timeOfDay
              ? dayjs(streetRateSettings.timeOfDay, 'HH:mm')
              : null,
        emails: cronSettings.emails || streetRateSettings.emails || [],
      });

      setFrequency(cronSettings.frequency || streetRateSettings.frequency || 'Daily');
    } else if (scope === 'facility' && facilitySettings) {
      const streetRateSettings = facilitySettings.street_rate_settings || {};
      const ecriSettings = facilitySettings.ecri_settings || {};

      form.setFieldsValue({
        ...facilitySettings,
        ...streetRateSettings,
        ...ecriSettings,
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
  }, [facilitiesList, facilitySettings, scope]);

  // Helper functions for data transformation (matching v1 logic)
  const convertPercentageToDecimal = (value) => {
    return value ? value / 100 : null;
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

    // Save cron job settings (matching v1 logic)
    if (values.timeOfDay) {
      const timeString = values.timeOfDay.format
        ? values.timeOfDay.format('HH:mm')
        : values.timeOfDay;
      const [hour, minute] = timeString.split(':');
      const cronJobData = {
        customer_id: customerId,
        frequency: values.frequency,
        minute: parseInt(minute, 10),
        hour: parseInt(hour, 10),
        day_of_week: values.frequency === 'Weekly' ? values.weekday : 0,
        day_of_month: values.frequency === 'Monthly' ? values.dayOfMonth : 1,
        emails: values.emails || [],
      };

      await updateCronJobSettings(cronJobData).unwrap();
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
    if (!facilityId) {
      showError('No facility selected');
      return;
    }
    try {
      await uploadUnitRanking({ facilityId, file }).unwrap();
      showSuccess('Unit ranking uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload unit ranking');
    }
  };

  const handleDownloadSample = async () => {
    if (!facilityId) {
      showError('No facility selected');
      return;
    }
    try {
      const result = await downloadSampleXLSX(facilityId).unwrap();
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
    if (!facilityId) {
      showError('No facility selected');
      return;
    }
    try {
      const result = await exportUnitRanking(facilityId).unwrap();
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
            form={form}
            layout="vertical"
            onFinish={onFinish}
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
            {scope === 'facility' && (
              <>
                <Divider orientation="left">Status</Divider>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      label={
                        <span>
                          <SettingOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                          Status
                          <Tooltip title="Enable or disable this facility.">
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                          </Tooltip>
                        </span>
                      }
                      name="status"
                    >
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
                  </Col>
                </Row>
                <Divider orientation="left">Profile</Divider>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      label={
                        <span>
                          <SettingOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                          Profile
                          <Tooltip title="Select the facility profile type.">
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                          </Tooltip>
                        </span>
                      }
                      name="profile"
                    >
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
                  </Col>
                </Row>
              </>
            )}

            <Divider orientation="left">Street Rate Strategy</Divider>

            {/* Strategy Selection with Hint */}

            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label={
                    <span>
                      <BulbOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                      Street Rate Strategy
                      <Tooltip title="Your selection will apply to all facilities.">
                        <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                      </Tooltip>
                    </span>
                  }
                  name="street_rate_strategy"
                >
                  <Segmented
                    size="middle"
                    value={currentStrategy}
                    options={scope === 'portfolio' ? PORTFOLIO_STRATEGY_OPTIONS : STRATEGY_OPTIONS}
                    onChange={handleStrategyChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label={
                    <span>
                      <SettingOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      Value Pricing
                      <Tooltip title="Configure value pricing settings for your facilities.">
                        <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                      </Tooltip>
                    </span>
                  }
                  name="value_pricing"
                >
                  <Segmented
                    size="middle"
                    value={currentValuePricing}
                    options={scope === 'portfolio' ? PORTFOLIO_VALUE_PRICING_OPTIONS : VALUE_PRICING_OPTIONS}
                    onChange={handleValuePricingChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Unit Ranking Upload - only show for facility scope */}
            {scope === 'facility' && (
              <>
                <Divider orientation="left">Unit Ranking Upload</Divider>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      label={
                        <span>
                          <BulbOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                          Unit Ranking Upload
                          <Tooltip title="Upload unit ranking data for this facility.">
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                          </Tooltip>
                        </span>
                      }
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
                  </Col>
                </Row>
              </>
            )}

            {/* Street Rate Update Strategy - only show for portfolio scope */}
            {scope === 'portfolio' && (
              <>
                <Divider orientation="left">Street Rate Update Strategy</Divider>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item label="Frequency" name="frequency">
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
                  </Col>

                  {/* Day of Week - only show for Weekly frequency */}
                  {frequency === 'Weekly' && (
                    <Col xs={24} md={12} lg={8}>
                      <Form.Item label="Day of Week" name="weekday">
                        <Segmented
                          size="middle"
                          options={WEEKDAY_OPTIONS}
                        />
                      </Form.Item>
                    </Col>
                  )}

                  {/* Day of Month - only show for Monthly frequency */}
                  {frequency === 'Monthly' && (
                    <Col xs={24} md={12} lg={8}>
                      <Form.Item label="Day of Month" name="dayOfMonth">
                        <Select size="middle">
                          {Array.from({ length: 31 }, (_, i) => (
                            <Option key={i + 1} value={i + 1}>
                              {i + 1}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}

                  {/* Time of Day - show for Weekly and Monthly */}
                  {(frequency === 'Weekly' || frequency === 'Monthly') && (
                    <Col xs={24} md={12} lg={8}>
                      <Form.Item
                        label={
                          <span>
                            <ClockCircleOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                            Time of Day
                            <Tooltip title="Set the time when updates should be executed.">
                              <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                            </Tooltip>
                          </span>
                        }
                        name="timeOfDay"
                        className="full-width-picker"
                      >
                        <TimePicker format="HH:mm" size="middle" />
                      </Form.Item>
                    </Col>
                  )}

                  <Col xs={24} md={24} lg={16}>
                    <Form.Item label="Notification Emails" name="emails">
                      <Select
                        size="middle"
                        mode="tags"
                        tokenSeparators={[',']}
                        placeholder="Add email and press Enter"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Divider orientation="left">Rates To Update</Divider>
            <Row gutter={[16, 16]}>
              {/* Facility-specific fields */}
              {scope === 'facility' && (
                <>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item
                      name="overridePortfolio"
                      valuePropName="checked"
                      label="Override Portfolio Rate Setting"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </>
              )}

              <Col xs={24} md={12} lg={8}>
                <Form.Item name="web_rate" valuePropName="checked" label="Web Rate">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item name="street_rate" valuePropName="checked" label="Street Rate">
                  <Switch />
                </Form.Item>
              </Col>

              {/* Rate hold on occupancy - only show for portfolio scope */}
              {scope === 'portfolio' && (
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    name="rate_hold_on_occupancy"
                    valuePropName="checked"
                    label="Do not decrease rates on fully occupied types"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              )}
            </Row>

            <Divider orientation="left">Revenue Goal</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Average Percent Increase"
                  name="averagePercentIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Rate Increase Criteria</Divider>
            <Row gutter={[16, 16]}>
              {/* Notification Days - only show for portfolio scope */}
              {scope === 'portfolio' && (
                <Col xs={24} md={12} lg={8}>
                  <Form.Item
                    label="Notification Days"
                    name="notificationDays"
                    className="full-width-number"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Max Dollar Increase"
                  name="maxDollarIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} addonBefore="$" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Min Dollar Increase"
                  name="minDollarIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} addonBefore="$" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Max Percent Increase"
                  name="maxPercentIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Min Percent Increase"
                  name="minPercentIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Store Occupancy Threshold"
                  name="storeOccupancyThreshold"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Time Since Last Increase (months)"
                  name="timeSinceLastIncrease"
                  className="full-width-number"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Time Since Move-in (months)"
                  name="timeSinceMoveIn"
                  className="full-width-number"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Limit Above Street Rate"
                  name="limitAboveStreetRate"
                  className="full-width-number"
                >
                  <InputNumber min={0} addonBefore="$" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Max Move-Out Probability"
                  name="maxMoveOutProbability"
                  className="full-width-number"
                >
                  <InputNumber min={0} max={100} addonBefore="%" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} icon={<SaveOutlined />}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </PageFrame>
  );
};

export default Settings;
