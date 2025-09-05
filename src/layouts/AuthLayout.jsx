import { Layout, Typography, theme } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content, Footer } = Layout;
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
        }}
      >
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
      </Content>

      <Footer
        style={{
          textAlign: 'center',
          background: 'transparent',
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          ©2025 Sparebox Technologes
        </Text>
      </Footer>
    </Layout>
  );
};

export default AuthLayout;
