import PageFrame from '@/components/common/PageFrame';
import { showError, showSuccess } from '@/utils/messageService';
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  SyncOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  Space,
  Spin,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectPortfolioId } from '@/features/auth/authSelector';
import {
  useUpdatePortfolioSettingsMutation,
  useGetPortfolioDetailsByIdQuery,
  useGetPortfoliosListQuery,
  useGetPortfolioCompaniesQuery,
  useGetPortfolioFacilitiesQuery,
  useGetPortfolioCustomerUsersQuery,
  useCreatePortfolioUserMutation,
  useDeletePortfolioUserMutation,
  useLookupStorTrackMutation,
  useUpdateFacilityStorTrackMutation,
  useSyncPortfolioFacilitiesMutation,

} from '@/api/settingsApi';
import CreatePortfolio from '@/components/widgets/Portfolio/Modal/CreatePortfolio';
import DeleteUserModal from '@/components/widgets/Portfolio/Modal/DeleteUserModal';
import StorTrackModal from '@/components/widgets/Portfolio/Modal/StorTrackModal';
import './Portfolio.less';

const { Option } = Select;

const Portfolio = () => {
  const { id: portfolioId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();

  // State
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [storTrackModalVisible, setStorTrackModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const [createPortfolioVisible, setCreatePortfolioVisible] = useState(false);

  // Modal states
  const [deleteUserModalVisible, setDeleteUserModalVisible] = useState(false);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);

  // Loading states
  const [deletingUser, setDeletingUser] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [updatingStorTrack, setUpdatingStorTrack] = useState(false);
  const [savingPortfolio, setSavingPortfolio] = useState(false);

  // Get user data from Redux
  const user = useSelector(selectUser);
  const currentPortfolioId = useSelector(selectPortfolioId);
  const isIntegrator = user?.role?.name === 'integrator';

  // API hooks
  const {
    data: portfolioSettings,
    isLoading: portfolioLoading,
    refetch: refetchPortfolio,
  } = useGetPortfolioDetailsByIdQuery(portfolioId || currentPortfolioId, {
    skip: !portfolioId && !currentPortfolioId,
  });

  // Get portfolio-specific facilities (matching v1: /portfolio/{portfolioId}/facility/list)
  const { data: facilitiesList } = useGetPortfolioFacilitiesQuery(portfolioId || currentPortfolioId, {
    skip: !portfolioId && !currentPortfolioId,
  });

  // Get portfolio-specific users (matching v1: /customers/users?portfolio_id={portfolioId}&role_id=1)
  const { data: usersList } = useGetPortfolioCustomerUsersQuery(portfolioId || currentPortfolioId, {
    skip: !portfolioId && !currentPortfolioId,
  });

  const { data: portfoliosList } = useGetPortfoliosListQuery();
  const { data: companiesData } = useGetPortfolioCompaniesQuery(undefined, {
    skip: !portfolioSettings || portfolioSettings.pms_type !== 'storedge',
  });
  const [updatePortfolioSettings] = useUpdatePortfolioSettingsMutation();
  const [createUser] = useCreatePortfolioUserMutation();
  const [deleteUser] = useDeletePortfolioUserMutation();
  const [lookupStorTrack] = useLookupStorTrackMutation();
  const [updateFacilityStorTrack] = useUpdateFacilityStorTrackMutation();
  const [syncPortfolioFacilities] = useSyncPortfolioFacilitiesMutation();

  // Load portfolio data
  useEffect(() => {
    if (portfolioSettings) {
      setSelectedPortfolio(portfolioSettings);
      const pmsCredentials = portfolioSettings.pms_credentials || {};

      form.setFieldsValue({
        portfolio_name: portfolioSettings.portfolio_name,
        status: portfolioSettings.status,
        pms_type: portfolioSettings.pms_type,
        username: pmsCredentials.username,
        password: pmsCredentials.password,
        corp_code:
          portfolioSettings.pms_type === 'storedge'
            ? pmsCredentials.company_id
            : pmsCredentials.corp_code,
      });

      // Companies will be loaded automatically via useGetPortfolioCompaniesQuery
    }
  }, [portfolioSettings, form]);

  // Load facilities from API
  useEffect(() => {
    if (facilitiesList) {
      setFacilities(facilitiesList);
    }
  }, [facilitiesList]);

  // Load users from API
  useEffect(() => {
    if (usersList) {
      setUsers(usersList);
    }
  }, [usersList]);

  // Update companies when API data changes
  useEffect(() => {
    if (companiesData) {
      setCompanies(companiesData);
    }
  }, [companiesData]);

  // Users are now loaded automatically via useGetPortfolioCustomerUsersQuery

  const handlePortfolioSave = async (values) => {
    try {
      setSavingPortfolio(true);
      const payload = {
        portfolio_name: values.portfolio_name,
        status: values.status,
        pms_type: values.pms_type,
        pms_credentials: {
          username: values.username,
          password: values.password,
          corp_code: values.corp_code,
          company_id: values.pms_type === 'storedge' ? values.corp_code : undefined,
        },
      };

      await updatePortfolioSettings({
        portfolioId: portfolioId || currentPortfolioId,
        ...payload,
      }).unwrap();

      showSuccess('Portfolio updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      showError('Failed to update portfolio');
    } finally {
      setSavingPortfolio(false);
    }
  };

  const handleAddUser = async (values) => {
    try {
      setAddingUser(true);

      // Create user payload matching v1 API
      const userData = {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.email,
        portfolio_id: portfolioId || currentPortfolioId,
      };

      await createUser(userData).unwrap();
      userForm.resetFields();
      setAddUserModalVisible(false);
      showSuccess('User added successfully!');
    } catch (error) {
      console.error('Add user error:', error);
      showError('Failed to add user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUserToDelete(user);
    setDeleteUserModalVisible(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!selectedUserToDelete) return;

    try {
      setDeletingUser(true);
      await deleteUser(selectedUserToDelete.id).unwrap();
      showSuccess('User deleted successfully!');
      setDeleteUserModalVisible(false);
      setSelectedUserToDelete(null);
    } catch (error) {
      console.error('Delete user error:', error);
      showError('Failed to delete user');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleSyncFacilities = async () => {
    if (!selectedPortfolio) {
      showError('Please select a portfolio');
      return;
    }

    setLoadingSync(true);
    try {
      // Call real API matching v1: GET /sync-data-ui/{portfolioId}
      await syncPortfolioFacilities(selectedPortfolio.id).unwrap();
      showSuccess('Facilities synced successfully!');
      refetchPortfolio();
    } catch (error) {
      console.error('Sync error:', error);
      showError('Failed to sync facilities');
    } finally {
      setLoadingSync(false);
    }
  };

  const handleStorTrackLookup = (facility) => {
    if (!facility.latitude || !facility.longitude) {
      showError('Facility latitude and longitude is required');
      return;
    }

    setSelectedFacility(facility);
    setStorTrackModalVisible(true);
    // Note: performStorTrackLookup will be called automatically by the modal's useEffect
  };

  const performStorTrackLookup = useCallback(async (facility) => {
    setLoadingStores(true);

    try {
      // Call real API matching v1: POST /portfolio/lookupStorTrack
      const payload = {
        latitude: facility.latitude,
        longitude: facility.longitude,
        radius: 1,
      };

      const result = await lookupStorTrack(payload).unwrap();
      setNearbyStores(result.stores || []);
    } catch (error) {
      console.error('Lookup error:', error);
      showError('Failed to lookup stores');
      setNearbyStores([]);
    } finally {
      setLoadingStores(false);
    }
  }, [lookupStorTrack, showError]);

  const handleStorTrackConfirm = async ({ facility, store, radius }) => {
    try {
      setUpdatingStorTrack(true);

      // Update facility with StorTrack settings (matching v1 API exactly)
      await updateFacilityStorTrack({
        facilityId: facility.id,
        stortrack_id: store.masterid,
        stortrack_radius: radius.toString(), // Convert to string to match v1 API
        portfolioId: portfolioId || currentPortfolioId, // For proper cache invalidation
      }).unwrap();

      showSuccess('StorTrack settings updated successfully!');
      setStorTrackModalVisible(false);
      setSelectedFacility(null);
      setNearbyStores([]);
    } catch (error) {
      console.error('StorTrack update error:', error);
      showError('Failed to update StorTrack settings');
    } finally {
      setUpdatingStorTrack(false);
    }
  };

  // Table columns for users
  const userColumns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
      align: 'center'
    },
    {
      title: 'Full Name',
      key: 'fullName',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteUserClick(record)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Table columns for facilities
  const facilityColumns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60,
      align: 'center'
    },
    {
      title: 'Facility Name',
      dataIndex: 'facility_name',
      key: 'facility_name',
    },
    {
      title: 'StorTrack Store Name',
      key: 'stortrack_name',
      render: (_, record) => record.comp_stores_info?.store_name || '-',
    },
    {
      title: 'Competitor Radius',
      key: 'radius',
      render: (_, record) => record.comp_stores_info?.distance || '-',
    },
    {
      title: 'Store Lookup',
      key: 'lookup',
      render: (_, record) => (
        <Button
          type="text"
          icon={<SearchOutlined />}
          onClick={() => handleStorTrackLookup(record)}
          title="Lookup StorTrack"
        />
      ),
      width: 120,
    },
  ];

  return (
    <PageFrame
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Portfolio</span>
          <Select
            style={{ width: 300 }}
            value={portfolioId ? parseInt(portfolioId) : undefined}
            onChange={(value) => navigate(`/portfolio/${value}`)}
            placeholder="Select Portfolio"
            loading={portfolioLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {portfoliosList?.map((portfolio) => (
              <Option key={portfolio.id} value={portfolio.id}>
                {portfolio.portfolio_name}
              </Option>
            ))}
          </Select>
        </div>
      }
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => setCreatePortfolioVisible(true)}
        >
          Create Portfolio
        </Button>,
        <Button
          key="sync"
          type="primary"
          danger
          icon={<SyncOutlined />}
          loading={loadingSync}
          onClick={handleSyncFacilities}
        >
          Sync Facilities
        </Button>,
      ]}
    >
      {/* Portfolio Settings */}
      <Card
        title={
          <Space>
            <SettingOutlined />
            Update Portfolio
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={savingPortfolio}
            onClick={() => form.submit()}
          >
            Save Portfolio
          </Button>
        }
        className="page-card"
        style={{ marginBottom: 24 }}
      >
        <Spin spinning={portfolioLoading || savingPortfolio} tip={
          portfolioLoading ? 'Loading portfolio settings...' :
            savingPortfolio ? 'Saving portfolio...' : 'Loading...'
        }>
          <Form form={form} layout="vertical" onFinish={handlePortfolioSave}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Portfolio Name"
                  name="portfolio_name"
                  rules={[{ required: true, message: 'Portfolio Name is required' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: 'Status is required' }]}
                >
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="PMS Type"
                  name="pms_type"
                  rules={[{ required: true, message: 'PMS Type is required' }]}
                >
                  <Select>
                    <Option value="storedge">storEDGE</Option>
                    <Option value="sitelink">SiteLink</Option>
                    <Option value="ssm">SSM</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item dependencies={['pms_type']} noStyle>
              {({ getFieldValue }) => {
                const pmsType = getFieldValue('pms_type');

                if (pmsType === 'sitelink' || pmsType === 'ssm') {
                  return (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Username" name="username">
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <Form.Item label="Password" name="password">
                          <Input.Password />
                        </Form.Item>
                      </Col>
                      {pmsType === 'sitelink' && (
                        <Col xs={24} md={12} lg={8}>
                          <Form.Item label="Corp Code" name="corp_code">
                            <Input />
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  );
                }

                if (pmsType === 'storedge') {
                  return (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12} lg={8}>
                        <Form.Item
                          label="Select Company"
                          name="corp_code"
                          rules={[{ required: true, message: 'Company is required' }]}
                        >
                          <Select placeholder="Select a company">
                            {companies.map((company) => (
                              <Option key={company.id} value={company.id}>
                                {company.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                }

                return null;
              }}
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      {/* Users Management - Only for Integrators */}
      {isIntegrator && selectedPortfolio && (
        <Card
          title={
            <Space>
              <UserOutlined />
              Users
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddUserModalVisible(true)}
            >
              Add New User
            </Button>
          }
          className="page-card"
          style={{ marginBottom: 24 }}
          styles={{ body: { padding: '1px 0 0' } }}
        >
          <Spin spinning={portfolioLoading || addingUser || deletingUser} tip={
            portfolioLoading ? 'Loading users...' :
              addingUser ? 'Adding user...' :
                deletingUser ? 'Deleting user...' : 'Loading...'
          }>
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="id"
              pagination={false}
            />
          </Spin>
        </Card>
      )}

      {/* StorTrack Integration */}
      {selectedPortfolio && (
        <Card title="StorTrack" className="page-card" styles={{ body: { padding: '1px 0 0' } }}>
          <Spin spinning={portfolioLoading || updatingStorTrack} tip={
            portfolioLoading ? 'Loading facilities...' :
              updatingStorTrack ? 'Updating StorTrack settings...' : 'Loading...'
          }>
            <Table
              columns={facilityColumns}
              dataSource={facilities}
              rowKey="id"
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Spin>
        </Card>
      )}

      {/* Create Portfolio Modal */}
      <CreatePortfolio
        visible={createPortfolioVisible}
        onCancel={() => setCreatePortfolioVisible(false)}
        onSuccess={(newPortfolio) => {
          // Navigate to the newly created portfolio
          if (newPortfolio?.id) {
            navigate(`/portfolio/${newPortfolio.id}`);
          }
        }}
      />

      {/* Delete User Confirmation Modal */}
      <DeleteUserModal
        open={deleteUserModalVisible}
        onOk={handleDeleteUserConfirm}
        onCancel={() => {
          setDeleteUserModalVisible(false);
          setSelectedUserToDelete(null);
        }}
        confirmLoading={deletingUser}
        selectedUser={selectedUserToDelete}
      />

      {/* StorTrack Modal */}
      <StorTrackModal
        open={storTrackModalVisible}
        onCancel={() => {
          setStorTrackModalVisible(false);
          setSelectedFacility(null);
          setNearbyStores([]);
        }}
        onConfirm={handleStorTrackConfirm}
        confirmLoading={updatingStorTrack}
        selectedFacility={selectedFacility}
        nearbyStores={nearbyStores}
        loadingStores={loadingStores}
        onLookupStores={performStorTrackLookup}
      />

      {/* Add User Modal */}
      <Modal
        title="Add New User"
        open={addUserModalVisible}
        onCancel={() => {
          setAddUserModalVisible(false);
          userForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleAddUser}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: 'First Name is required' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: 'Last Name is required' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setAddUserModalVisible(false);
                userForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={addingUser}
              >
                Add User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageFrame>
  );
};

export default Portfolio;
