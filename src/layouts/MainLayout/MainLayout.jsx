import { useLogoutMutation } from '@/api/authApi';
import { useThemeContext } from '@/contexts/ThemeContext';
import { clearToken } from '@/features/auth/authSlice';
import {
  AppstoreOutlined,
  BookOutlined,
  BulbOutlined,
  HomeOutlined,
  LineChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
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
  const { isDarkMode, toggleTheme, toggleDensity } = useThemeContext();

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
    const labelMap = {
      'street-rates': 'Street Rates',
      'existing-customer-rate-increases': 'Existing Customers',
      competitors: 'Competitors',
      reporting: 'Reporting',
      settings: 'Settings',
      portfolio: 'Portfolio',
    };
    const items = [{ title: <HomeOutlined />, onClick: () => navigate('/street-rates') }];

    pathSegments.forEach((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const title =
        labelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      items.push({ title, onClick: () => navigate(path) });
    });

    return items;
  };

  return (
    <Layout className="main-layout">
      <Navbar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        selectedKey={location.pathname}
        items={menuItems}
      />
      <Layout>
        <HeaderBar
          breadcrumbItems={getBreadcrumbItems()}
          userMenuItems={userMenuItems}
          onToggleTheme={toggleTheme}
          onToggleDensity={toggleDensity}
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
