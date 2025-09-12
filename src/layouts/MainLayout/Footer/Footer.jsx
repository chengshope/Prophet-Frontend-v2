import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const AppFooter = () => {
  return (
    <Footer className="main-footer" style={{ textAlign: 'center' }}>
      <Text type="secondary">©2025 Sparebox Technologies</Text>
    </Footer>
  );
};

export default AppFooter;
