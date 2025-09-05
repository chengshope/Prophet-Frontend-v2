import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useThemeContext } from '../contexts/ThemeContext'
import {
  Layout,
  Menu,
  Button,
  Typography,
  Space,
  Avatar,
  Dropdown,
  theme,
  Breadcrumb
} from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExperimentOutlined,
  HomeOutlined,
  BulbOutlined
} from '@ant-design/icons'
import { logout } from '../store/slices/authSlice'

const { Header, Sider, Content } = Layout
const { Title } = Typography

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { isDarkMode, toggleTheme } = useThemeContext()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      children: [
        {
          key: '/profile',
          label: 'View Profile',
          onClick: () => navigate('/profile')
        },
        {
          key: '/profile/settings',
          label: 'Settings',
          onClick: () => navigate('/profile/settings')
        }
      ]
    },
    {
      key: '/demo',
      icon: <ExperimentOutlined />,
      label: 'Demo',
      children: [
        {
          key: '/demo/counter',
          label: 'Counter Demo',
          onClick: () => navigate('/demo/counter')
        }
      ]
    }
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/profile/settings')
    },
    {
      key: 'theme',
      icon: <BulbOutlined />,
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true
    }
  ]

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const items = [
      {
        title: <HomeOutlined />,
        onClick: () => navigate('/dashboard')
      }
    ]

    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const title = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      items.push({
        title,
        onClick: () => navigate(path)
      })
    })

    return items
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <Title 
            level={4} 
            style={{ 
              margin: 0, 
              color: '#1890ff',
              display: collapsed ? 'none' : 'block'
            }}
          >
            Prophet
          </Title>
          {collapsed && (
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              P
            </Title>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
          </Space>

          <Space>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || 'User'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: '24px' }}>
          <Breadcrumb 
            items={getBreadcrumbItems()}
            style={{ marginBottom: '16px' }}
          />
          
          <div style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
