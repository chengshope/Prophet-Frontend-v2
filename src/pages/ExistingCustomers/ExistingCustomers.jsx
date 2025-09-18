import PageFrame from '@/components/common/PageFrame';
import { UserOutlined } from '@ant-design/icons';
import { Typography, Card, Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { getFormattedSummaryData } from '@/features/existingCustomers/existingCustomersSelector';
import ExistingCustomersWidget from '@/components/widgets/ExistingCustomers';
import './ExistingCustomers.less';

const { Text } = Typography;

const ExistingCustomers = () => {
  // Redux selectors for summary data (calculated from facilities)
  const summaryStats = useSelector(getFormattedSummaryData);

  return (
    <PageFrame title="Existing Customer Rate Increases" icon={<UserOutlined />}>
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text type="secondary">Total Eligible Tenants</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              {summaryStats?.totalTenants || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text type="secondary">Average Rate Increase %</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {summaryStats?.averageRateIncrease || '0.0'}%
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text type="secondary">Estimated Revenue Increase</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
              ${summaryStats?.estimatedRevenueIncrease || '0.00'}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Text type="secondary">Average Move-out Probability</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
              {summaryStats?.averageMoveOutProbability || '0.0'}%
            </div>
          </Card>
        </Col>
      </Row>
      <ExistingCustomersWidget />
    </PageFrame>
  );
};

export default ExistingCustomers;
