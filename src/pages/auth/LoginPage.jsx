import { useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice'
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Checkbox,
  Divider,
  Flex,
  message
} from 'antd'
import { UserOutlined, LockOutlined, GoogleOutlined, GithubOutlined } from '@ant-design/icons'

const { Title, Text, Link } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    // Clear any previous errors when component mounts
    if (error) {
      dispatch(clearError())
    }
  }, [])

  const onFinish = async (values) => {
    dispatch(loginStart())
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const userData = {
        id: 1,
        email: values.email,
        name: 'John Doe',
        role: 'admin'
      }
      
      dispatch(loginSuccess(userData))
      message.success('Login successful!')
      
      // Navigate to dashboard after successful login
      navigate('/dashboard')
    } catch (error) {
      dispatch(loginFailure('Login failed. Please try again.'))
      message.error('Login failed. Please try again.')
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    message.error('Please check your input and try again.')
  }

  return (
    <Flex vertical>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          Welcome Back
        </Title>
        <Text type="secondary">Sign in to your account</Text>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        size="large"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Enter your email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
          />
        </Form.Item>

        <Form.Item>
          <Flex justify='space-between'>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <RouterLink to="/forgot-password" style={{ color: '#1890ff' }}>
              Forgot password?
            </RouterLink>
          </Flex>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{margin: '0 0 14px'}}>Or</Divider>

      <Space direction="vertical" style={{ width: '100%', marginTop: 10 }}>
        <Button
          icon={<GoogleOutlined />}
          onClick={() => message.info('Google login not implemented yet')}
          block
          size='large'
        >
          Continue with Google
        </Button>
      </Space>
    </Flex>
  )
}

export default LoginPage
