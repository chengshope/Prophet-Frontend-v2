import PageFrame from '@/components/common/PageFrame';
import { showError, showSuccess } from '@/utils/messageService';
import {
  SaveOutlined,
  BulbOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  UploadOutlined,
  DownloadOutlined
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
  Alert,
  Upload,
} from 'antd';
import { useState } from 'react';
import './Settings.less';
const { Option } = Select;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState('portfolio');
  const [form] = Form.useForm();
  const [frequency, setFrequency] = useState('Daily');

  // Handle scope change
  const handleScopeChange = (value) => {
    setScope(value);
    // Reset form when scope changes
    form.resetFields();
  };

  // Handle frequency change to show/hide conditional fields
  const handleFrequencyChange = (value) => {
    setFrequency(value);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Settings updated:', values);
      showSuccess('Settings updated successfully!');
    } catch {
      showError('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageFrame
      title="Settings"
      extra={[
        <Select
          key="scope-select"
          size="middle"
          style={{ width: 200 }}
          value={scope}
          onChange={handleScopeChange}
        >
          <Option value="portfolio">Portfolio</Option>
          <Option value="facility">Facility (example)</Option>
        </Select>,
      ]}
    >
      <Card
        title={`${scope === 'portfolio' ? 'Portfolio' : 'Facility'} Settings`}
        className="page-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            scope: 'portfolio',
            frequency: 'Daily',
            weekday: 'Mon',
            dayOfMonth: 1,
            timeOfDay: null,
            emails: [],
            overridePortfolio: false,
            web_rate: false,
            street_rate: true,
            rate_hold_on_occupancy: false,
            averagePercentIncrease: null,
            maxDollarIncrease: null,
            minDollarIncrease: null,
            maxPercentIncrease: null,
            minPercentIncrease: null,
            storeOccupancyThreshold: null,
            timeSinceLastIncrease: null,
            timeSinceMoveIn: null,
            limitAboveStreetRate: null,
            maxMoveOutProbability: null,
          }}
        >
          {/* Facility Profile - only show for facility scope */}
          {scope === 'facility' && (
            <>
              <Divider orientation="left">Facility Profile</Divider>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Profile Type" name="facilityProfile">
                    <Segmented
                      size="middle"
                      options={[
                        { label: 'Stabilized', value: 'stabilized' },
                        { label: 'Lease Up', value: 'lease_up' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {/* Profile - only show for facility scope */}
          {scope === 'facility' && (
            <>
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
                      options={[
                        { label: 'Stabilized', value: 'stabilized' },
                        { label: 'Lease Up', value: 'lease_up' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Divider orientation="left">Street Rate Strategy</Divider>

          {/* Strategy Selection with Hint */}
          <Alert
            message="Your selection will apply to all facilities."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

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
                name="strategy"
              >
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Segmented
                    size="middle"
                    options={[
                      { label: 'Mirror Competitors', value: 'mirror' },
                      { label: 'Maverick', value: 'maverick' },
                      { label: 'Happy Medium', value: 'happy_medium' },
                      { label: 'Maverick+', value: 'maverick_plus' },
                    ]}
                  />
                  {scope === 'portfolio' && (
                    <Button
                      size="middle"
                      style={{
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #d9d9d9'
                      }}
                    >
                      Multiple
                    </Button>
                  )}
                </div>
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
                name="valuePricing"
              >
                <Segmented
                  size="middle"
                  options={
                    scope === 'portfolio'
                      ? [
                          { label: 'On', value: 'on' },
                          { label: 'Off', value: 'off' },
                          { label: 'Multiple', value: 'multiple' },
                        ]
                      : [
                          { label: 'On', value: 'on' },
                          { label: 'Off', value: 'off' },
                        ]
                  }
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
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <Upload
                        accept=".xlsx"
                        showUploadList={false}
                        beforeUpload={() => false}
                      >
                        <Button icon={<UploadOutlined />}>
                          Click Here To Upload Your Unit Ranking
                        </Button>
                      </Upload>
                      <Button
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          // Download sample XLSX logic
                          console.log('Download sample XLSX');
                        }}
                      >
                        Download Sample XLSX
                      </Button>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={() => {
                          // Export unit ranking logic
                          console.log('Export unit ranking');
                        }}
                      >
                        Click Here To Export Unit Ranking
                      </Button>
                    </div>
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
                        options={[
                          { label: 'Mon', value: 'Mon' },
                          { label: 'Tue', value: 'Tue' },
                          { label: 'Wed', value: 'Wed' },
                          { label: 'Thu', value: 'Thu' },
                          { label: 'Fri', value: 'Fri' },
                          { label: 'Sat', value: 'Sat' },
                          { label: 'Sun', value: 'Sun' },
                        ]}
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
                <InputNumber min={0} max={100} addonAfter="%" />
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
                  <InputNumber min={0} />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Max Dollar Increase"
                name="maxDollarIncrease"
                className="full-width-number"
              >
                <InputNumber min={0} addonBefore="$" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Min Dollar Increase"
                name="minDollarIncrease"
                className="full-width-number"
              >
                <InputNumber min={0} addonBefore="$" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Max Percent Increase"
                name="maxPercentIncrease"
                className="full-width-number"
              >
                <InputNumber min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Min Percent Increase"
                name="minPercentIncrease"
                className="full-width-number"
              >
                <InputNumber min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Store Occupancy Threshold"
                name="storeOccupancyThreshold"
                className="full-width-number"
              >
                <InputNumber min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Time Since Last Increase (months)"
                name="timeSinceLastIncrease"
                className="full-width-number"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Time Since Move-in (months)"
                name="timeSinceMoveIn"
                className="full-width-number"
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Limit Above Street Rate"
                name="limitAboveStreetRate"
                className="full-width-number"
              >
                <InputNumber min={0} addonBefore="$" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Max Move-Out Probability"
                name="maxMoveOutProbability"
                className="full-width-number"
              >
                <InputNumber min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageFrame>
  );
};

export default Settings;
