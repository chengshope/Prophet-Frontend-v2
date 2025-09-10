import { Layout, Typography, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import ProphetLogo from '../../assets/prophet_logo.svg';

const { Content } = Layout;
const { Text } = Typography;

const AuthLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          flex: 1,
        }}
      >
        {/* Logo above the modal */}
        <div
          style={{
            marginBottom: '40px',
            textAlign: 'center',
          }}
        >
          <img
            src={ProphetLogo}
            alt="Prophet Logo"
            style={{
              height: '60px',
              width: 'auto',
            }}
          />
        </div>

        {/* Authentication form modal */}
        <div
          style={{
            background: colorBgContainer,
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '450px',
          }}
        >
          <Outlet />
        </div>

        {/* License below the modal */}
        <div
          style={{
            marginTop: '40px',
            textAlign: 'center',
          }}
        >
          <Text style={{ color: 'gray' }}>©2025 Sparebox Technologies</Text>
        </div>
      </Content>
    </Layout>
  );
};

export default AuthLayout;
