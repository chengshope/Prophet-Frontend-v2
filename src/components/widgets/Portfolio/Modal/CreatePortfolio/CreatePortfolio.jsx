import {
  useCreatePortfolioAndUsersMutation,
  useGetPortfolioCompaniesQuery,
} from '@/api/portfolioApi';
import { showError, showSuccess } from '@/utils/messageService';
import {
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Row, Select, Space, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

const CreatePortfolio = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [createPortfolio, { isLoading }] = useCreatePortfolioAndUsersMutation();
  const { data: companies, isLoading: companiesLoading } = useGetPortfolioCompaniesQuery();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setUsers([]);
    }
  }, [visible, form]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        portfolio_name: values.portfolio_name,
        status: values.status,
        pms_type: values.pms_type,
        users: users,
        pms_credentials: {},
      };

      if (values.pms_type === 'sitelink') {
        payload.pms_credentials.username = values.username;
        payload.pms_credentials.password = values.password;
        payload.pms_credentials.corp_code = values.corp_code;
      } else if (values.pms_type === 'storedge') {
        payload.pms_credentials.company_id = values.corp_code;
      } else if (values.pms_type === 'ssm_cloud') {
        payload.pms_credentials.username = values.username;
        payload.pms_credentials.password = values.password;
      }

      const result = await createPortfolio(payload).unwrap();
      showSuccess('Portfolio and users created successfully!');
      form.resetFields();
      setUsers([]);
      onSuccess?.(result);
      onCancel();
    } catch (error) {
      console.error('Error creating portfolio:', error);
      showError('Failed to create portfolio');
    }
  };

  const addUser = () => {
    setUsers([...users, { fullName: '', email: '' }]);
  };

  const removeUser = (index) => {
    const newUsers = users.filter((_, i) => i !== index);
    setUsers(newUsers);
  };

  const updateUser = (index, field, value) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    setUsers(newUsers);
  };

  const userColumns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateUser(index, 'fullName', e.target.value)}
          placeholder="Enter full name"
          status={!text ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => updateUser(index, 'email', e.target.value)}
          placeholder="Enter email address"
          type="email"
          status={!text ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeUser(index)}
          title="Remove User"
        />
      ),
    },
  ];

  const pmsType = Form.useWatch('pms_type', form);

  return (
    <Modal
      title={
        <Space>
          <UserAddOutlined />
          Create Portfolio
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'active',
          pms_type: 'storedge',
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Portfolio Name"
              name="portfolio_name"
              rules={[{ required: true, message: 'Portfolio Name is required' }]}
            >
              <Input placeholder="Enter portfolio name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Status is required' }]}
            >
              <Select>
                <Option value="active">Active</Option>
                <Option value="disabled">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  PMS Type
                  <Tooltip title="Property Management System type">
                    <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                  </Tooltip>
                </span>
              }
              name="pms_type"
              rules={[{ required: true, message: 'PMS Type is required' }]}
            >
              <Select>
                <Option value="storedge">storEDGE</Option>
                <Option value="sitelink">SiteLink</Option>
                <Option value="ssm_cloud">SSM Cloud</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* PMS Credentials based on type */}
        {(pmsType === 'sitelink' || pmsType === 'ssm_cloud') && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Username is required' }]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Password is required' }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {pmsType === 'sitelink' && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Corp Code"
                name="corp_code"
                rules={[{ required: true, message: 'Corp Code is required' }]}
              >
                <Input placeholder="Enter corp code" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {pmsType === 'storedge' && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Corp Code"
                name="corp_code"
                rules={[{ required: true, message: 'Company is required' }]}
              >
                <Select
                  placeholder="Select a company"
                  showSearch
                  loading={companiesLoading}
                  notFoundContent={companiesLoading ? 'Loading...' : 'No companies found'}
                >
                  {Array.isArray(companies) &&
                    companies.map((company) => (
                      <Option key={company.id} value={company.id}>
                        {company.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Divider orientation="left">Users</Divider>

        <div style={{ marginBottom: 16 }}>
          <Button type="dashed" onClick={addUser} icon={<PlusOutlined />} style={{ width: '100%' }}>
            Add User
          </Button>
        </div>

        {users.length > 0 && (
          <Table
            dataSource={users}
            columns={userColumns}
            pagination={false}
            size="small"
            rowKey={(record, index) => index}
            style={{ marginBottom: 24 }}
          />
        )}

        <Row justify="end" gutter={[8, 8]}>
          <Col>
            <Button onClick={onCancel}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create Portfolio
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreatePortfolio;
