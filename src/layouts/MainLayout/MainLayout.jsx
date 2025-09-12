import { useLogoutMutation } from '@/api/authApi';
import { useThemeContext } from '@/contexts/ThemeContext';
import { clearToken } from '@/features/auth/authSlice';
import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  BulbOutlined,
  DashboardOutlined,
  HomeOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isIntegrator = user?.role?.name === 'integrator' || user?.user?.role?.name === 'integrator';
  const { isDarkMode, toggleTheme } = useThemeContext();

  const [logoutApi] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (e) {
      // ignore API failure and still clear local state
    } finally {
      dispatch(clearToken());
    }
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/street-rates',
      icon: <AppstoreOutlined />,
      label: 'Street Rates',
      onClick: () => navigate('/street-rates'),
    },
    {
      key: '/existing-customer-rate-increases',
      icon: <TeamOutlined />,
      label: 'Existing Customers',
      onClick: () => navigate('/existing-customer-rate-increases'),
    },
    {
      key: '/competitors',
      icon: <ShopOutlined />,
      label: 'Competitors',
      onClick: () => navigate('/competitors'),
    },
    {
      key: '/reporting',
      icon: <LineChartOutlined />,
      label: 'Reporting',
      onClick: () => navigate('/reporting'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    ...(isIntegrator
      ? [
          {
            key: '/portfolio',
            icon: <BookOutlined />,
            label: 'Portfolio',
            onClick: () => navigate('/portfolio'),
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      key: 'theme',
      icon: <BulbOutlined />,
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items = [
      {
        title: <HomeOutlined />,
        onClick: () => navigate('/dashboard'),
      },
    ];

    pathSegments.forEach((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const title = segment.charAt(0).toUpperCase() + segment.slice(1);

      items.push({
        title,
        onClick: () => navigate(path),
      });
    });

    return items;
  };

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="sidebar">
        <div className={`logo-area ${collapsed ? 'collapsed' : ''}`}>
          <Title level={4} className={`logo-title ${collapsed ? 'hidden' : ''}`}>
            Prophet
          </Title>
          {collapsed && (
            <Title level={4} className="logo-title">
              P
            </Title>
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          className="navigation-menu"
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="top-header">
          <Space className="header-left" size={12}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle-btn"
            />
            <Breadcrumb items={getBreadcrumbItems()} className="breadcrumb-nav" />
          </Space>

          <Space className="header-right" size={12}>
            <Input.Search placeholder="Search" allowClear className="top-search" />
            <Button type="text" icon={<BulbOutlined />} onClick={toggleTheme} />
            <Badge dot>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Space className="user-profile">
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || 'User'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="page-content">
          <div className="content-area">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
