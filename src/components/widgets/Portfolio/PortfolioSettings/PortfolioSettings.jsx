import { useGetPortfolioCompaniesQuery } from '@/api/portfolioApi';
import {
  useGetPortfolioDetailsByIdQuery,
  useUpdatePortfolioSettingsMutation,
} from '@/api/settingsApi';
import { selectPortfolioId } from '@/features/auth/authSelector';
import { showError, showSuccess } from '@/utils/messageService';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, Row, Select, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const { Option } = Select;

const PortfolioSettings = ({ portfolioId }) => {
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState([]);

  const currentPortfolioId = useSelector(selectPortfolioId);
  const activePortfolioId = portfolioId || currentPortfolioId;

  // API hooks
  const { data: portfolioSettings, isLoading: portfolioLoading } = useGetPortfolioDetailsByIdQuery(
    activePortfolioId,
    {
      skip: !activePortfolioId,
    }
  );

  const { data: companiesData } = useGetPortfolioCompaniesQuery();

  const [updatePortfolioSettings, { isLoading: savingPortfolio }] =
    useUpdatePortfolioSettingsMutation();

  // Load portfolio data and populate form
  useEffect(() => {
    if (portfolioSettings) {
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
    }
  }, [portfolioSettings, form]);

  // Update companies when API data changes
  useEffect(() => {
    if (companiesData) {
      setCompanies(companiesData);
    }
  }, [companiesData]);

  // Portfolio Settings Save Handler
  const handlePortfolioSave = async (values) => {
    try {
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
        portfolioId: activePortfolioId,
        ...payload,
      }).unwrap();

      showSuccess('Portfolio updated successfully!');
    } catch (error) {
      console.error('Save error:', error);
      showError('Failed to update portfolio');
    }
  };

  return (
    <Card
      title={
        <Space>
          <SettingOutlined />
          Update Portfolio
        </Space>
      }
      extra={
        <Button
          variant="dashed"
          color="green"
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
      <Spin
        spinning={portfolioLoading || savingPortfolio}
        tip={
          portfolioLoading
            ? 'Loading portfolio settings...'
            : savingPortfolio
              ? 'Saving portfolio...'
              : 'Loading...'
        }
      >
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
                  <Option value="ssm_cloud">SSM Cloud</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item dependencies={['pms_type']} noStyle>
            {({ getFieldValue }) => {
              const pmsType = getFieldValue('pms_type');

              if (pmsType === 'sitelink' || pmsType === 'ssm_cloud') {
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
  );
};

export default PortfolioSettings;
