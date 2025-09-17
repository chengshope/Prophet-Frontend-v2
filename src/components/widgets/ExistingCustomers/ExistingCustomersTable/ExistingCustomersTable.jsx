import { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Modal, message } from 'antd';
import { EyeOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePublishIndividualRateChangesMutation } from '@/api/existingCustomersApi';
import TenantDetails from './TenantDetails';
import { getMoveOutProbabilityColor } from '../../../../utils/LegacyV1/config';
import { getChangedEcriIDs } from '../../../../utils/LegacyV1/localStorage';

const ExistingCustomersTable = ({
  data,
  loading,
  sortColumn,
  sortDirection,
  onSortChanged,
  onFacilitiesChanged,
  pagination,
  portfolioSettings,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [tenantDetailsOpen, setTenantDetailsOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const navigate = useNavigate();

  const [publishIndividualRateChanges, { isLoading: isSubmittingIndividual }] =
    usePublishIndividualRateChangesMutation();

  // Handle row expansion
  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.facility_id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.facility_id));
    }
  };

  // Handle individual facility publish
  const handlePublishIndividual = (facility) => {
    setSelectedFacility(facility);
    setPublishModalOpen(true);
  };

  const confirmPublishIndividual = async () => {
    if (!selectedFacility) return;

    try {
      // Get changed ECRI IDs for this facility
      const changedIds = getChangedEcriIDs();
      const facilityTenantIds = selectedFacility.tenants?.map((t) => t.id) || [];
      const facilityChangedIds = changedIds.filter((id) => facilityTenantIds.includes(id));

      if (facilityChangedIds.length === 0) {
        message.warning('No changes to publish for this facility');
        setPublishModalOpen(false);
        return;
      }

      await publishIndividualRateChanges({
        facilityId: selectedFacility.facility_id,
        ecriIds: facilityChangedIds,
      }).unwrap();

      message.success(`Rate changes published successfully for ${selectedFacility.facility_name}`);
      setPublishModalOpen(false);
      setSelectedFacility(null);
    } catch (error) {
      console.error('Error publishing individual rates:', error);
      message.error('Failed to publish rate changes');
      setPublishModalOpen(false);
    }
  };

  // Handle tenant details
  const handleViewTenantDetails = (tenant) => {
    setSelectedTenant(tenant);
    setTenantDetailsOpen(true);
  };

  // Handle tenant change
  const handleTenantChange = (facilityId) => {
    onFacilitiesChanged(facilityId);
  };

  // Table columns
  const columns = [
    {
      title: 'Facility Name',
      dataIndex: 'facility_name',
      key: 'facility_name',
      sorter: true,
      sortOrder:
        sortColumn === 'facility_name' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.facility_id}</div>
        </div>
      ),
    },
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      sorter: true,
      sortOrder: sortColumn === 'market' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      render: (_, record) => `${record.city}, ${record.state}`,
    },
    {
      title: 'Eligible Tenants',
      dataIndex: 'tenant_total',
      key: 'eligible_tenants',
      sorter: true,
      sortOrder:
        sortColumn === 'eligible_tenants' ? (sortDirection === 'asc' ? 'ascend' : 'descend') : null,
      align: 'center',
      render: (value) => value || 0,
    },
    {
      title: 'Average Rate Increase %',
      dataIndex: 'avr_rate_increase_percent',
      key: 'avr_rate_increase_percent',
      sorter: true,
      sortOrder:
        sortColumn === 'avr_rate_increase_percent'
          ? sortDirection === 'asc'
            ? 'ascend'
            : 'descend'
          : null,
      align: 'center',
      render: (value) => `${(value || 0).toFixed(1)}%`,
    },
    {
      title: 'Estimated Revenue Increase',
      dataIndex: 'estimated_revenue_increase',
      key: 'estimated_revenue_increase',
      sorter: true,
      sortOrder:
        sortColumn === 'estimated_revenue_increase'
          ? sortDirection === 'asc'
            ? 'ascend'
            : 'descend'
          : null,
      align: 'center',
      render: (value) => `$${(value || 0).toLocaleString()}`,
    },
    {
      title: 'Average Move-out Probability',
      dataIndex: 'avr_moveout_probability',
      key: 'avr_moveout_probability',
      sorter: true,
      sortOrder:
        sortColumn === 'avr_moveout_probability'
          ? sortDirection === 'asc'
            ? 'ascend'
            : 'descend'
          : null,
      align: 'center',
      render: (value) => {
        const percentage = value * 100 || 0;
        const color = getMoveOutProbabilityColor(percentage);
        return <Tag color={color}>{percentage.toFixed(1)}%</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Publish Individual">
            <Button
              type="primary"
              size="small"
              icon={<CloudUploadOutlined />}
              onClick={() => handlePublishIndividual(record)}
              disabled={!record.tenants || record.tenants.length === 0}
            >
              Publish
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Expanded row render
  const expandedRowRender = (record) => {
    const tenantColumns = [
      {
        title: 'Tenant Name',
        dataIndex: 'tenant_name',
        key: 'tenant_name',
        render: (text, tenant) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Unit: {tenant.unit_number}</div>
          </div>
        ),
      },
      {
        title: 'Current Rate',
        dataIndex: 'current_rate',
        key: 'current_rate',
        align: 'center',
        render: (value) => `$${(value || 0).toFixed(2)}`,
      },
      {
        title: 'New Rate',
        dataIndex: 'new_rate',
        key: 'new_rate',
        align: 'center',
        render: (value) => `$${(value || 0).toFixed(2)}`,
      },
      {
        title: 'Rate Increase',
        key: 'rate_increase',
        align: 'center',
        render: (_, tenant) => {
          const increase =
            ((tenant.new_rate - tenant.current_rate) / tenant.current_rate) * 100 || 0;
          return `${increase.toFixed(1)}%`;
        },
      },
      {
        title: 'Move-out Probability',
        dataIndex: 'moveout_probability',
        key: 'moveout_probability',
        align: 'center',
        render: (value) => {
          const percentage = value * 100 || 0;
          const color = getMoveOutProbabilityColor(percentage);
          return <Tag color={color}>{percentage.toFixed(1)}%</Tag>;
        },
      },
      {
        title: 'Actions',
        key: 'tenant_actions',
        align: 'center',
        render: (_, tenant) => (
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTenantDetails(tenant)}
          >
            Details
          </Button>
        ),
      },
    ];

    return (
      <Table
        columns={tenantColumns}
        dataSource={record.tenants || []}
        pagination={false}
        size="small"
        rowKey="tenant_id"
      />
    );
  };

  // Handle table sorting
  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
      onSortChanged(sorter.field, direction);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.data || []}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender,
          rowExpandable: (record) => record.tenants && record.tenants.length > 0,
        }}
        rowKey="facility_id"
        size="middle"
        scroll={{ x: 1200 }}
      />

      {/* Publish Individual Modal */}
      <Modal
        title={`Publish Rate Changes - ${selectedFacility?.facility_name}`}
        open={publishModalOpen}
        onOk={confirmPublishIndividual}
        onCancel={() => setPublishModalOpen(false)}
        confirmLoading={isSubmittingIndividual}
        okText="Publish"
        cancelText="Cancel"
      >
        <p>Are you sure you want to publish rate changes for this facility?</p>
        {selectedFacility && (
          <div>
            <p>
              <strong>Facility:</strong> {selectedFacility.facility_name}
            </p>
            <p>
              <strong>Eligible Tenants:</strong> {selectedFacility.tenant_total || 0}
            </p>
          </div>
        )}
      </Modal>

      {/* Tenant Details Modal */}
      {selectedTenant && (
        <TenantDetails
          open={tenantDetailsOpen}
          onClose={() => {
            setTenantDetailsOpen(false);
            setSelectedTenant(null);
          }}
          tenant={selectedTenant}
          onTenantChange={handleTenantChange}
          portfolioSettings={portfolioSettings}
        />
      )}
    </>
  );
};

export default ExistingCustomersTable;
