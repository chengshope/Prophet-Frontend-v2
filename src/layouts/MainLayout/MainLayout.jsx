import { selectUserEmail } from '@/features/auth/authSelector';
import { clearToken } from '@/features/auth/authSlice';
import {
  AppstoreOutlined,
  BookOutlined,
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

import SuspenseLoading from '@/components/common/SuspenseLoading';
import { Suspense, useState } from 'react';
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
  const email = useSelector(selectUserEmail);

  const handleLogout = async () => {
    dispatch(clearToken());
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
      icon: <UserOutlined />,
      label: email,
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

    const items = [
      {
        title: <HomeOutlined />,
      },
    ];

    pathSegments.forEach((segment) => {
      const title =
        labelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      items.push({
        title,
      });
    });

    return items;
  };

  const getSelectedMenuKey = () => {
    const currentPath = location.pathname;

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
        <HeaderBar breadcrumbItems={getBreadcrumbItems()} userMenuItems={userMenuItems} />
        <Content className="page-content">
          <Suspense fallback={<SuspenseLoading />} key={location.pathname}>
            <div className="content-area">
              <Outlet />
            </div>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
