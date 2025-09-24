import { useLogoutMutation } from '@/api/authApi';
import { useThemeContext } from '@/contexts/ThemeContext';
import { clearToken } from '@/features/auth/authSlice';
import { selectPortfolioName, selectUsername } from '@/features/auth/authSelector';
import {
  AppstoreOutlined,
  BookOutlined,

  HomeOutlined,
  LineChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,

} from '@ant-design/icons';
import { Layout } from 'antd';
import HeaderBar from './Header';
import Navbar from './Navbar';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MainLayout.less';

const { Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isIntegrator = user?.role?.name === 'integrator' || user?.user?.role?.name === 'integrator';
  const { isDarkMode } = useThemeContext();
  const portfolioName = useSelector(selectPortfolioName);
  const username = useSelector(selectUsername);

  const [logoutApi] = useLogoutMutation();
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // ignore API failure and still clear local state
    } finally {
      dispatch(clearToken());
    }
  };

  const menuItems = [
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
      key: 'user-info',
      label: (
        <div style={{
          padding: '8px 0',
          borderBottom: '1px solid var(--ant-color-border)',
          marginBottom: '8px',
          pointerEvents: 'none'
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {username || 'User'}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--ant-color-text-secondary)',
            marginTop: '2px'
          }}>
            {portfolioName}
          </div>
        </div>
      ),
      disabled: true,
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
    const labelMap = {
      'street-rates': 'Street Rates',
      'existing-customer-rate-increases': 'Existing Customers',
      competitors: 'Competitors',
      reporting: 'Reporting',
      settings: 'Settings',
      portfolio: 'Portfolio',
      profile: 'Profile',
    };

    // Start with Home icon (no navigation)
    const items = [{
      title: <HomeOutlined />
    }];

    // Add breadcrumb items for each path segment (no navigation)
    pathSegments.forEach((segment) => {
      const title = labelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      items.push({
        title
      });
    });

    return items;
  };

  // Get the selected menu key based on current path
  const getSelectedMenuKey = () => {
    const currentPath = location.pathname;

    // Handle sub-routes by checking if current path starts with any menu item key
    const matchingMenuItem = menuItems.find(
      (item) => currentPath === item.key || currentPath.startsWith(item.key + '/')
    );

    return matchingMenuItem ? matchingMenuItem.key : currentPath;
  };

  return (
    <Layout className="main-layout">
      <Navbar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        selectedKey={getSelectedMenuKey()}
        items={menuItems}
      />
      <Layout>
        <HeaderBar
          breadcrumbItems={getBreadcrumbItems()}
          userMenuItems={userMenuItems}
        />
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
