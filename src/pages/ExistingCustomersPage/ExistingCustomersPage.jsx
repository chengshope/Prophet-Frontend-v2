import { Card, Result, Space, Typography } from 'antd';

const { Title } = Typography;

const ExistingCustomersPage = () => {
  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Existing Customers</Title>
      <Card>
        <Result status="info" title="Existing Customers" subTitle="UI coming soon" />
      </Card>
    </Space>
  );
};

export default ExistingCustomersPage;
