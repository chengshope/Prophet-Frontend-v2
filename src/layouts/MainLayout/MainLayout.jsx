import {
  BulbOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Dropdown, Layout, Menu, Space, theme, Typography } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';
import './MainLayout.less';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Profile',
      children: [
        {
          key: '/profile',
          label: 'View Profile',
          onClick: () => navigate('/profile'),
        },
        {
          key: '/profile/settings',
          label: 'Settings',
          onClick: () => navigate('/profile/settings'),
        },
      ],
    },
    {
      key: '/demo',
      icon: <ExperimentOutlined />,
      label: 'Demo',
      children: [
        {
          key: '/demo/counter',
          label: 'Counter Demo',
          onClick: () => navigate('/demo/counter'),
        },
      ],
    },
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
      onClick: () => navigate('/profile/settings'),
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
      onClick: () => {},
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
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sidebar"
        style={{ background: colorBgContainer }}
      >
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
        <Header className="top-header" style={{ background: colorBgContainer }}>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-toggle-btn"
            />
          </Space>

          <Space>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Space className="user-profile">
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name || 'User'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="page-content">
          <Breadcrumb items={getBreadcrumbItems()} className="breadcrumb-nav" />

          <div
            className="content-area"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
