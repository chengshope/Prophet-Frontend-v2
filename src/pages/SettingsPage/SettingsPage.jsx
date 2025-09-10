import {
  BellOutlined,
  GlobalOutlined,
  SaveOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Switch,
  Typography,
} from 'antd';
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
      message.success('Settings updated successfully!');
    } catch {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Settings</Title>

      <Row gutter={[16, 16]}>
        {/* Account Settings */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <>
                <SecurityScanOutlined /> Account Settings
              </>
            }
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                twoFactor: false,
              }}
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your current password!',
                  },
                ]}
              >
                <Input.Password placeholder="Enter current password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                  {
                    min: 8,
                    message: 'Password must be at least 8 characters!',
                  },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your new password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Passwords do not match!')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              <Divider />

              <Form.Item
                label="Two-Factor Authentication"
                name="twoFactor"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Notification Settings */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <>
                <BellOutlined /> Notification Settings
              </>
            }
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                emailNotifications: true,
                pushNotifications: false,
                smsNotifications: false,
                marketingEmails: true,
              }}
            >
              <Form.Item
                label="Email Notifications"
                name="emailNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Push Notifications"
                name="pushNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="SMS Notifications"
                name="smsNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Marketing Emails"
                name="marketingEmails"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Save Notifications
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Preferences */}
        <Col span={24}>
          <Card
            title={
              <>
                <GlobalOutlined /> Preferences
              </>
            }
          >
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                language: 'en',
                timezone: 'UTC-5',
                theme: 'light',
                dateFormat: 'MM/DD/YYYY',
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Language" name="language">
                    <Select>
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Timezone" name="timezone">
                    <Select>
                      <Option value="UTC-8">Pacific Time (UTC-8)</Option>
                      <Option value="UTC-7">Mountain Time (UTC-7)</Option>
                      <Option value="UTC-6">Central Time (UTC-6)</Option>
                      <Option value="UTC-5">Eastern Time (UTC-5)</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Theme" name="theme">
                    <Select>
                      <Option value="light">Light</Option>
                      <Option value="dark">Dark</Option>
                      <Option value="auto">Auto</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Date Format" name="dateFormat">
                    <Select>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Save Preferences
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SettingsPage;
