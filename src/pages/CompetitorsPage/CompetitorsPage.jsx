import { Card, Result, Space, Typography } from 'antd';

const { Title } = Typography;

const CompetitorsPage = () => {
  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Competitors</Title>
      <Card>
        <Result status="info" title="Competitors" subTitle="UI coming soon" />
      </Card>
    </Space>
  );
};

export default CompetitorsPage;
