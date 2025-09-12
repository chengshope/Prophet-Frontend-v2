import { showError, showSuccess } from '@/utils/messageService';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Result, Typography } from 'antd';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Reset email for:', values.email);
      setEmailSent(true);
      showSuccess('Password reset email sent!');
    } catch {
      showError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Result
        status="success"
        title="Check Your Email"
        subTitle="We've sent a password reset link to your email address. Please check your inbox and follow the instructions."
        extra={[
          <RouterLink to="/login" key="login">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Back to Login
            </Button>
          </RouterLink>,
        ]}
      />
    );
  }

  return (
    <Flex vertical>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Forgot Password?
        </Title>
        <Text type="secondary">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </div>

      <Form
        name="forgot-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{ marginTop: 12 }}
          >
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Text type="secondary">
          Remember your password?{' '}
          <RouterLink to="/login" style={{ color: '#1890ff' }}>
            Back to Login
          </RouterLink>
        </Text>
      </div>
    </Flex>
  );
};

export default ForgotPasswordPage;
