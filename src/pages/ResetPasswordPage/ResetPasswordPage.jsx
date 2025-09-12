import { ArrowLeftOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Result, Typography } from 'antd';
import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation } from '../../api/authApi';

const { Title, Text } = Typography;

const ResetPasswordPage = () => {
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
      }).unwrap();
      setDone(true);
    } catch (err) {
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
    <Flex vertical gap="middle">
      <Flex vertical align="center" gap="small">
        <Title level={2}>Reset Password</Title>
        <Text type="secondary">Enter your new password below.</Text>
      </Flex>

      <Form
        name="reset-password"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item label="Email" name="email" initialValue={emailParam}>
          <Input prefix={<MailOutlined />} disabled />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="password"
          rules={[{ required: true, message: 'Please input your new password!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Update Password
          </Button>
        </Form.Item>
      </Form>

      <Flex justify="center" align="center" gap="small">
        <Text type="secondary">Remembered your password?</Text>
        <RouterLink to="/login">
          <Button type="link">Back to Login</Button>
        </RouterLink>
      </Flex>
    </Flex>
  );
};

export default ResetPasswordPage;
