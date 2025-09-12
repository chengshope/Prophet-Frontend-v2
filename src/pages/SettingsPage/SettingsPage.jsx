import { showError, showSuccess } from '@/utils/messageService';
import {
    SaveOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, InputNumber, Radio, Row, Select, Switch, TimePicker, Typography } from 'antd';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);

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
    <div>
      <Title level={2}>Settings</Title>

      <Card title="Portfolio & Facility Settings" style={{ marginBottom: 16 }}>
        <Form
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
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Scope" name="scope">
                <Select>
                  <Option value="portfolio">Portfolio</Option>
                  <Option value="facility">Facility (example)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Street Rate Strategy" name="strategy">
                <Radio.Group>
                  <Radio.Button value="mirror">Mirror Competitors</Radio.Button>
                  <Radio.Button value="maverick">Maverick</Radio.Button>
                  <Radio.Button value="happy_medium">Happy Medium</Radio.Button>
                  <Radio.Button value="maverick_plus">Maverick+</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Value Pricing" name="valuePricing">
                <Radio.Group>
                  <Radio.Button value="on">On</Radio.Button>
                  <Radio.Button value="off">Off</Radio.Button>
                  <Radio.Button value="multiple">Multiple</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Street Rate Update Strategy</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Frequency" name="frequency">
                <Radio.Group>
                  <Radio.Button value="Daily">Daily</Radio.Button>
                  <Radio.Button value="Weekly">Weekly</Radio.Button>
                  <Radio.Button value="Monthly">Monthly</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Day of Week" name="weekday">
                <Radio.Group>
                  <Radio.Button value="Mon">Mon</Radio.Button>
                  <Radio.Button value="Tue">Tue</Radio.Button>
                  <Radio.Button value="Wed">Wed</Radio.Button>
                  <Radio.Button value="Thur">Thur</Radio.Button>
                  <Radio.Button value="Fri">Fri</Radio.Button>
                  <Radio.Button value="Sat">Sat</Radio.Button>
                  <Radio.Button value="Sun">Sun</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Day of Month" name="dayOfMonth">
                <Select>
                  {Array.from({ length: 31 }, (_, i) => (
                    <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Time of Day" name="timeOfDay">
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={16}>
              <Form.Item label="Notification Emails" name="emails">
                <Select mode="tags" tokenSeparators={[',']} placeholder="Add email and press Enter" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Rates To Update</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="overridePortfolio" valuePropName="checked" label="Override Portfolio Rate Setting (Facility)">
                <Switch />
              </Form.Item>
            </Col>
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
            <Col xs={24} md={12} lg={8}>
              <Form.Item name="rate_hold_on_occupancy" valuePropName="checked" label="Do not decrease rates on fully occupied types (Portfolio)">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Revenue Goal</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Average Percent Increase" name="averagePercentIncrease">
                <InputNumber style={{ width: '100%' }} min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Rate Increase Criteria</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Notification Days (Portfolio)" name="notificationDays">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Max Dollar Increase" name="maxDollarIncrease">
                <InputNumber style={{ width: '100%' }} min={0} addonBefore="$" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Min Dollar Increase" name="minDollarIncrease">
                <InputNumber style={{ width: '100%' }} min={0} addonBefore="$" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Max Percent Increase" name="maxPercentIncrease">
                <InputNumber style={{ width: '100%' }} min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Min Percent Increase" name="minPercentIncrease">
                <InputNumber style={{ width: '100%' }} min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Store Occupancy Threshold" name="storeOccupancyThreshold">
                <InputNumber style={{ width: '100%' }} min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Time Since Last Increase (months)" name="timeSinceLastIncrease">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Time Since Move-in (months)" name="timeSinceMoveIn">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Limit Above Street Rate" name="limitAboveStreetRate">
                <InputNumber style={{ width: '100%' }} min={0} addonBefore="$" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Max Move-Out Probability" name="maxMoveOutProbability">
                <InputNumber style={{ width: '100%' }} min={0} max={100} addonAfter="%" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>Save</Button>
          </Form.Item>
        </Form>
      </Card>


    </div>
  );
};

export default SettingsPage;
