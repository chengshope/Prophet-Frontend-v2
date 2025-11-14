import { useResetPasswordMutation } from '@/api/authApi';
import { ArrowLeftOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, Result, Typography } from 'antd';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') ? decodeURIComponent(searchParams.get('email')) : '';
  const tokenParam = searchParams.get('token') || '';

  const [done, setDone] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    try {
      await resetPassword({
        email: emailParam,
        token: tokenParam,
        password: values.password,
        confirmPassword: values.confirmPassword,
        termsAccepted: values.termsAccepted,
      }).unwrap();
      setDone(true);
    } catch {
      // errors are handled globally by baseQuery
    }
  };

  if (done) {
    return (
      <Result
        status="success"
        title="Password Reset Successful"
        subTitle="Your password has been updated. You can now log in with your new password."
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
          Reset Password
        </Title>
        <Text type="secondary">Enter your new password below.</Text>
      </Flex>

      <Form
        name="reset-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item name="email" initialValue={emailParam}>
          <Input prefix={<MailOutlined />} disabled />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
        </Form.Item>

        <Form.Item
          name="termsAccepted"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('You must accept the Terms of Service')),
            },
          ]}
        >
          <Checkbox>
            I agree to the{' '}
            <a
              href="https://spareboxtech.com/terms-of-service-bigfoot-prophet/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service.
            </a>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            block
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" style={{ textAlign: 'center', marginTop: 6 }}>
        <Text type="secondary">
          Remembered your password? <Link to="/login">Back to Login</Link>
        </Text>
      </Flex>
    </Flex>
  );
};

export default ResetPassword;
