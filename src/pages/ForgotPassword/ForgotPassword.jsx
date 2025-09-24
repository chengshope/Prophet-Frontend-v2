import { useForgotPasswordMutation } from '@/api/authApi';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Result, Typography } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values) => {
    try {
      await forgotPassword({ email: values.email }).unwrap();
      setEmailSent(true);
    } catch {
      // baseQuery already shows error messages; keep a fallback just in case
    }
  };

  if (emailSent) {
    return (
      <Result
        status="success"
        title="Check Your Email"
        subTitle="We've sent a password reset link to your email address. Please check your inbox and follow the instructions."
        extra={[
          <Link to="/login" key="login">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Back to Login
            </Button>
          </Link>,
        ]}
      />
    );
  }

  return (
    <Flex vertical>
      <Flex vertical align="center" gap="small" style={{ marginBottom: 30, textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Forgot Password?
        </Title>
        <Text type="secondary">
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </Flex>

      <Form
        name="forgot-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
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
            loading={isLoading}
            block
            style={{ marginTop: 12 }}
          >
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>

      <Flex justify='center' style={{ textAlign: 'center', marginTop: 6 }}>
        <Text type="secondary">
          Remember your password?{' '}
          <Link to="/login">
            Back to Login
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default ForgotPassword;
