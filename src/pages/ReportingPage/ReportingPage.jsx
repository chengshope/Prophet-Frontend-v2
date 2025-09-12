import { Card, Result, Space, Typography } from 'antd';

const { Title } = Typography;

const ReportingPage = () => {
  return (
    <Space direction="vertical" size="large">
      <Title level={3}>Reporting</Title>
      <Card>
        <Result status="info" title="Reporting" subTitle="UI coming soon" />
      </Card>
    </Space>
  );
};

export default ReportingPage;
