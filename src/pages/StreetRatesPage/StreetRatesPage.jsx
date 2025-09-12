import { Card, Result, Space, Typography } from 'antd';

const { Title } = Typography;

const StreetRatesPage = () => {
  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Street Rates</Title>
      <Card>
        <Result status="info" title="Street Rates" subTitle="UI coming soon" />
      </Card>
    </Space>
  );
};

export default StreetRatesPage;
