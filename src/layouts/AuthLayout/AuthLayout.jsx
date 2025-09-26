import { Layout, Typography, theme } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import ProphetLogo from '../../assets/prophet_logo.svg';
import './AuthLayout.less';
import { Suspense } from 'react';
import SuspenseLoading from '@/components/common/SuspenseLoading';

const { Content } = Layout;
const { Text } = Typography;

const AuthLayout = () => {
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="auth-page">
      <Content className="auth-container">
        <Suspense fallback={<SuspenseLoading />} key={location.pathname}>
          <div className="brand-logo">
            <img src={ProphetLogo} alt="Prophet Logo" />
          </div>

          <div className="login-form" style={{ background: colorBgContainer }}>
            <Outlet />
          </div>

          <div className="copyright-notice">
            <Text>©2025 Sparebox Technologies</Text>
          </div>
        </Suspense>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
