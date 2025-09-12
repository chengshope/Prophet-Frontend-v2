import { showInfo } from '@/utils/messageService';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Flex, Form, Input, Space, Typography } from 'antd';
import { Link as RouterLink } from 'react-router-dom';
import { useLoginMutation } from '../../api/authApi';
import GoogleIcon from '../../components/GoogleIcon';

const { Title, Text } = Typography;

const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      await login({
        email: values.email,
        password: values.password,
        remember: !!values.remember,
      }).unwrap();
    } catch (error) {
      // Auto
    }
  };

  return (
    <Flex vertical>
      <Flex vertical align="center" gap="small" style={{ marginBottom: '24px' }}>
        <Title level={2}>Welcome Back</Title>
        <Text type="secondary">Sign in to your account</Text>
      </Flex>

      <Form name="login" onFinish={onFinish} autoComplete="off" layout="vertical" size="large">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
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
            <RouterLink to="/forgot-password">
                Forgot password?
            </RouterLink>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ margin: '0 0 14px' }}>Or</Divider>

      <Space direction="vertical">
        <Button
          icon={<GoogleIcon size={16} />}
          onClick={() => showInfo('Google login not implemented yet')}
          block
          size="large"
        >
          Continue with Google
        </Button>
      </Space>
    </Flex>
  );
};

export default LoginPage;
