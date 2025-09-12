import { Layout, Typography, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import ProphetLogo from '../../assets/prophet_logo.svg';
import './AuthLayout.less';

const { Content } = Layout;
const { Text } = Typography;

const AuthLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="auth-page">
      <Content className="auth-container">
        {/* Logo above the modal */}
        <div className="brand-logo">
          <img src={ProphetLogo} alt="Prophet Logo" />
        </div>

        {/* Authentication form modal */}
        <div className="login-form" style={{ background: colorBgContainer }}>
          <Outlet />
        </div>

        {/* License below the modal */}
        <div className="copyright-notice">
          <Text>©2025 Sparebox Technologies</Text>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
