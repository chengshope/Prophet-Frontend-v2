import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Card, Col, Descriptions, Row, Space, Tag, Typography } from 'antd';
import { useSelector } from 'react-redux';
import './Profile.less';

const { Title, Text } = Typography;

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <Title level={2}>Profile</Title>

      <Row gutter={[16, 16]}>
        {/* Profile Header */}
        <Col span={24}>
          <Card>
            <div className="profile-header">
              <Avatar size={120} icon={<UserOutlined />} />
              <div className="user-details">
                <Title level={3} className="user-name">
                  {user?.name || 'John Doe'}
                </Title>
                <Text type="secondary" className="user-role">
                  {user?.role || 'Administrator'}
                </Text>
                <div className="status-badges">
                  <Tag color="blue">Active</Tag>
                  <Tag color="green">Verified</Tag>
                </div>
                <div className="profile-actions">
                  <Space>
                    <Button type="primary" icon={<EditOutlined />}>
                      Edit Profile
                    </Button>
                    <Button>Change Password</Button>
                  </Space>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Profile Details */}
        <Col xs={24} lg={16}>
          <Card title="Personal Information">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Full Name">{user?.name || 'John Doe'}</Descriptions.Item>
              <Descriptions.Item label="Email" icon={<MailOutlined />}>
                {user?.email || 'john.doe@example.com'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone" icon={<PhoneOutlined />}>
                +1 (555) 123-4567
              </Descriptions.Item>
              <Descriptions.Item label="Address" icon={<EnvironmentOutlined />}>
                123 Main Street, New York, NY 10001
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color="blue">{user?.role || 'Administrator'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Department">Engineering</Descriptions.Item>
              <Descriptions.Item label="Join Date">January 15, 2024</Descriptions.Item>
              <Descriptions.Item label="Last Login">Today at 9:30 AM</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Quick Stats */}
        <Col xs={24} lg={8}>
          <Card title="Quick Stats" className="stats-card">
            <div className="stats-grid">
              <div className="stat-item">
                <Title level={3} className="stat-number primary">
                  156
                </Title>
                <Text type="secondary">Projects Completed</Text>
              </div>
              <div className="stat-item">
                <Title level={3} className="stat-number success">
                  89%
                </Title>
                <Text type="secondary">Success Rate</Text>
              </div>
              <div className="stat-item">
                <Title level={3} className="stat-number warning">
                  4.8
                </Title>
                <Text type="secondary">Average Rating</Text>
              </div>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div style={{ fontSize: '14px' }}>
              <div
                style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Text strong>Updated profile picture</Text>
                <br />
                <Text type="secondary">2 hours ago</Text>
              </div>
              <div
                style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Text strong>Completed project review</Text>
                <br />
                <Text type="secondary">1 day ago</Text>
              </div>
              <div
                style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Text strong>Changed password</Text>
                <br />
                <Text type="secondary">3 days ago</Text>
              </div>
              <div>
                <Text strong>Joined new team</Text>
                <br />
                <Text type="secondary">1 week ago</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
