import { Card, Result, Space, Typography } from 'antd';

const { Title } = Typography;

const PortfolioPage = () => {
  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Portfolio</Title>
      <Card>
        <Result status="info" title="Portfolio" subTitle="UI coming soon" />
      </Card>
    </Space>
  );
};

export default PortfolioPage;
