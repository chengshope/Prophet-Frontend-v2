import { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Tag,
} from 'antd';
import { useBulkUpdateTenantsMutation } from '@/api/existingCustomersApi';
import { getMoveOutProbabilityColor } from '../../../../utils/LegacyV1/config';
import { setChangedEcriIDs, getChangedEcriIDs } from '../../../../utils/LegacyV1/localStorage';

const { Title, Text } = Typography;

const TenantDetails = ({ open, onClose, tenant, onTenantChange, portfolioSettings }) => {
  const [form] = Form.useForm();
  const [hasChanges, setHasChanges] = useState(false);
  const [localTenant, setLocalTenant] = useState(tenant);

  const [bulkUpdateTenants, { isLoading: isUpdating }] = useBulkUpdateTenantsMutation();

  useEffect(() => {
    if (tenant) {
      setLocalTenant(tenant);
      form.setFieldsValue({
        new_rate: tenant.new_rate,
        exclude_submit: tenant.exclude_submit || false,
      });
      setHasChanges(false);
    }
  }, [tenant, form]);

  const handleFormChange = (changedFields, allFields) => {
    const newRate = allFields.new_rate;
    const excludeSubmit = allFields.exclude_submit;

    const updatedTenant = {
      ...localTenant,
      new_rate: newRate,
      exclude_submit: excludeSubmit,
    };

    setLocalTenant(updatedTenant);

    // Check if there are changes from original
    const hasRateChange = newRate !== tenant.new_rate;
    const hasExcludeChange = excludeSubmit !== (tenant.exclude_submit || false);
    setHasChanges(hasRateChange || hasExcludeChange);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const updatedTenant = {
        ...localTenant,
        new_rate: values.new_rate,
        exclude_submit: values.exclude_submit,
      };

      // Update via API
      await bulkUpdateTenants([updatedTenant]).unwrap();

      // Update local storage for tracking changes
      const changedIds = getChangedEcriIDs();
      if (!changedIds.includes(tenant.id)) {
        setChangedEcriIDs([...changedIds, tenant.id]);
      }

      // Notify parent of change
      onTenantChange(tenant.facility_id);

      onClose();
    } catch (error) {
      console.error('Error updating tenant:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setHasChanges(false);
    onClose();
  };

  // Calculate rate increase percentage
  const rateIncreasePercent =
    localTenant?.current_rate && localTenant?.new_rate
      ? ((localTenant.new_rate - localTenant.current_rate) / localTenant.current_rate) * 100
      : 0;

  // Calculate move-out probability color
  const moveOutProbability = localTenant?.moveout_probability * 100 || 0;
  const moveOutColor = getMoveOutProbabilityColor(moveOutProbability);

  return (
    <Modal
      title="Tenant Details"
      open={open}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={isUpdating}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>,
      ]}
    >
      {localTenant && (
        <div>
          {/* Tenant Information */}
          <Title level={4}>Tenant Information</Title>
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Text strong>Name: </Text>
              <Text>{localTenant.tenant_name}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Unit: </Text>
              <Text>{localTenant.unit_number}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Tenant ID: </Text>
              <Text>{localTenant.tenant_id}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Move-in Date: </Text>
              <Text>{localTenant.move_in_date || 'N/A'}</Text>
            </Col>
          </Row>

          <Divider />

          {/* Rate Information */}
          <Title level={4}>Rate Information</Title>
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={8}>
              <Text strong>Current Rate: </Text>
              <div style={{ fontSize: '18px', color: '#1890ff' }}>
                ${(localTenant.current_rate || 0).toFixed(2)}
              </div>
            </Col>
            <Col span={8}>
              <Text strong>Proposed New Rate: </Text>
              <div style={{ fontSize: '18px', color: '#52c41a' }}>
                ${(localTenant.new_rate || 0).toFixed(2)}
              </div>
            </Col>
            <Col span={8}>
              <Text strong>Rate Increase: </Text>
              <div
                style={{ fontSize: '18px', color: rateIncreasePercent > 0 ? '#52c41a' : '#f5222d' }}
              >
                {rateIncreasePercent.toFixed(1)}%
              </div>
            </Col>
          </Row>

          {/* Move-out Probability */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Text strong>Move-out Probability: </Text>
              <Tag color={moveOutColor} style={{ marginLeft: '8px' }}>
                {moveOutProbability.toFixed(1)}%
              </Tag>
            </Col>
            <Col span={12}>
              <Text strong>Revenue Impact: </Text>
              <Text style={{ color: '#faad14' }}>
                ${((localTenant.new_rate - localTenant.current_rate) * 12).toFixed(2)}/year
              </Text>
            </Col>
          </Row>

          <Divider />

          {/* Edit Form */}
          <Title level={4}>Edit Tenant</Title>
          <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="New Rate"
                  name="new_rate"
                  rules={[
                    { required: true, message: 'Please enter a new rate' },
                    { type: 'number', min: 0, message: 'Rate must be positive' },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    prefix="$"
                    precision={2}
                    min={0}
                    step={0.01}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Exclude from Submit"
                  name="exclude_submit"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {/* Additional Information */}
          {portfolioSettings && (
            <>
              <Divider />
              <Title level={4}>Portfolio Settings</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Max Rate Increase: </Text>
                  <Text>{portfolioSettings.max_rate_increase || 'N/A'}%</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Min Rate Increase: </Text>
                  <Text>{portfolioSettings.min_rate_increase || 'N/A'}%</Text>
                </Col>
              </Row>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TenantDetails;
