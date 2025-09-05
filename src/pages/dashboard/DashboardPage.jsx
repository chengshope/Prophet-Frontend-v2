import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  List,
  Avatar,
} from 'antd';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);

  const recentActivities = [
    {
      title: 'New user registration',
      description: 'John Smith joined the platform',
      time: '2 minutes ago',
      avatar: <Avatar icon={<UserOutlined />} />,
    },
    {
      title: 'Order completed',
      description: 'Order #12345 has been processed',
      time: '15 minutes ago',
      avatar: (
        <Avatar
          icon={<ShoppingCartOutlined />}
          style={{ backgroundColor: '#52c41a' }}
        />
      ),
    },
    {
      title: 'Payment received',
      description: '$1,250 payment from client',
      time: '1 hour ago',
      avatar: (
        <Avatar
          icon={<DollarOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
    },
    {
      title: 'System update',
      description: 'Database optimization completed',
      time: '3 hours ago',
      avatar: (
        <Avatar
          icon={<RiseOutlined />}
          style={{ backgroundColor: '#722ed1' }}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Welcome back, {user?.name || 'User'}! 👋</Title>
        <Text type="secondary">
          Here's what's happening with your business today.
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={11280}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>+12%</span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1128}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>+8%</span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={112893}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>+15%</span>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Growth Rate"
              value={9.3}
              precision={1}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Performance Chart */}
        <Col xs={24} lg={16}>
          <Card
            title="Performance Overview"
            extra={<a href="#">View Details</a>}
          >
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Sales Performance</Text>
              <Progress percent={75} status="active" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>User Engagement</Text>
              <Progress percent={60} status="active" strokeColor="#52c41a" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>System Performance</Text>
              <Progress percent={90} status="active" strokeColor="#1890ff" />
            </div>
            <div>
              <Text strong>Goal Achievement</Text>
              <Progress percent={85} status="active" strokeColor="#722ed1" />
            </div>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={8}>
          <Card
            title="Recent Activities"
            extra={<a href="#">View All</a>}
            style={{ height: '100%' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.avatar}
                    title={item.title}
                    description={
                      <div>
                        <div>{item.description}</div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <ClockCircleOutlined /> {item.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Quick Actions">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 16px' }}
                >
                  <UserOutlined
                    style={{
                      fontSize: '32px',
                      color: '#1890ff',
                      marginBottom: '8px',
                    }}
                  />
                  <div>Add New User</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 16px' }}
                >
                  <ShoppingCartOutlined
                    style={{
                      fontSize: '32px',
                      color: '#52c41a',
                      marginBottom: '8px',
                    }}
                  />
                  <div>Create Order</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 16px' }}
                >
                  <TrophyOutlined
                    style={{
                      fontSize: '32px',
                      color: '#faad14',
                      marginBottom: '8px',
                    }}
                  />
                  <div>View Reports</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  bodyStyle={{ padding: '24px 16px' }}
                >
                  <RiseOutlined
                    style={{
                      fontSize: '32px',
                      color: '#722ed1',
                      marginBottom: '8px',
                    }}
                  />
                  <div>Analytics</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
