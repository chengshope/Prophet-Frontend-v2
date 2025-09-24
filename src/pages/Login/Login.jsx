import { useLoginMutation } from '@/api/authApi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        remember: !!values.remember,
      }).unwrap();
    } catch {
      // Auto catched
    }
  };

  return (
    <Flex vertical>
      <Flex vertical align="center" gap="small" style={{ marginBottom: 30, textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Welcome Back
        </Title>
        <Text type="secondary">
          Secure access to AI-driven recommendations for street rates and existing-customer rate
          increases.
        </Text>
      </Flex>

      <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical" size="large">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Flex justify="space-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password">Forgot password?</Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Login;
