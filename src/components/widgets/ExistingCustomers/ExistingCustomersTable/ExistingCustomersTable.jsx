import { useState } from 'react';
import { Table, Button, Space, Tag, Modal, message, Flex, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  usePublishIndividualRateChangesMutation,
  useBulkUpdateTenantsMutation,
} from '@/api/existingCustomersApi';
import { getMoveOutProbabilityColor } from '../../../../utils/config';
import {
  selectExistingCustomersFacilities,
  getSavedTenantChangesByFacility,
  getFacilityHasSavedChanges,
  getChangedTenantsByFacilityId,
  getNewTenantChanges,
} from '@/features/existingCustomers/existingCustomersSelector';
import {
  clearSavedTenantChangesByIds,
  clearChangedTenantsByFacilityId,
  mergeToSavedTenantChanges,
  updateTenant,
} from '@/features/existingCustomers/existingCustomersSlice';
import {
  removeSavedTenantChangesByIds,
  mergeSavedTenantChanges,
  setSavedTenantChanges,
} from '@/utils/localStorage';
import TenantEditingTable from './TenantEditingTable';
import './ExistingCustomersTable.less';

const { Text } = Typography;

const ExistingCustomersTable = ({ loading, onSortChanged, pagination }) => {
  // internal ui state
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  // modal state
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // reducer selectors
  const facilities = useSelector(selectExistingCustomersFacilities);
  const changedTenantsByFacility = useSelector(getChangedTenantsByFacilityId);
  const newTenantChanges = useSelector(getNewTenantChanges);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [publishIndividualRateChanges, { isLoading: isSubmittingIndividual }] =
    usePublishIndividualRateChangesMutation();
  const [bulkUpdateTenants] = useBulkUpdateTenantsMutation();

  // Handle row expansion
  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.facility_id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.facility_id));
    }
  };

  // Handle close expanded row
  const handleClose = (facility) => {
    setExpandedRowKeys(expandedRowKeys.filter((key) => key !== facility.facility_id));
  };

  // Handle save changes for current facility (similar to street rates)
  const handleSaveChanges = async (facility) => {
    try {
      // Get all changed tenants for this facility
      const facilityChangedTenants = changedTenantsByFacility[facility.facility_id] || [];

      if (facilityChangedTenants.length === 0) {
        message.warning('No changes to save for this facility');
        return;
      }

      // Prepare data for bulk update (v1 format)
      const bulkUpdateData = facilityChangedTenants.map((tenant) => ({
        id: tenant.ecri_id,
        new_rate: parseFloat(tenant.new_rate),
        exclude_submit: tenant.exclude_submit || false,
      }));

      // Save ALL changes to backend
      await bulkUpdateTenants(bulkUpdateData).unwrap();

      // After successful save, move tenant changes to saved state for publishing
      const facilityNewTenantChanges = newTenantChanges.filter(
        (tenant) => tenant.facility_id === facility.facility_id
      );

      if (facilityNewTenantChanges.length > 0) {
        // Merge tenant changes to localStorage and RTK state
        const updatedSavedTenants = mergeSavedTenantChanges(facilityNewTenantChanges);
        dispatch(mergeToSavedTenantChanges(facilityNewTenantChanges));

        // Update localStorage with the merged data
        setSavedTenantChanges(updatedSavedTenants);
      }

      // Clear all changes for this facility from RTK state
      dispatch(clearChangedTenantsByFacilityId(facility.facility_id));

      message.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving tenant changes:', error);
      message.error('Failed to save changes');
    }
  };

  // Handle individual facility publish
  const handlePublishIndividual = (facility) => {
    setSelectedFacility(facility);
    setPublishModalOpen(true);
  };

  // Get saved tenant changes for selected facility
  const savedTenantChangesForFacility = useSelector((state) =>
    selectedFacility ? getSavedTenantChangesByFacility(state, selectedFacility.facility_id) : []
  );

  const confirmPublishIndividual = async () => {
    if (!selectedFacility) return;

    try {
      if (savedTenantChangesForFacility.length === 0) {
        message.warning(
          'No saved changes to publish for this facility. Please save changes first.'
        );
        setPublishModalOpen(false);
        return;
      }

      const facilityEcriIds = savedTenantChangesForFacility.map((tenant) => tenant.ecri_id);

      await publishIndividualRateChanges({
        facilityId: selectedFacility.facility_id,
        ecriIds: facilityEcriIds,
      }).unwrap();

      message.success(`Rate changes published successfully for ${selectedFacility.facility_name}`);

      // Clear saved changes for this facility from Redux and localStorage
      dispatch(clearSavedTenantChangesByIds(facilityEcriIds));
      removeSavedTenantChangesByIds(facilityEcriIds);

      setPublishModalOpen(false);
      setSelectedFacility(null);
    } catch (error) {
      console.error('Error publishing individual rates:', error);
      message.error('Failed to publish rate changes');
      setPublishModalOpen(false);
    }
  };

  // Handle tenant changes in expanded row
  const handleTenantChange = (facilityId, tenant, field, value) => {
    const updatedTenant = { ...tenant, [field]: value };

    // Update tenant in Redux state
    dispatch(
      updateTenant({
        facilityId,
        tenant: updatedTenant,
        hasChanges: true,
      })
    );
  };

  // Table columns matching v1 structure
  const columns = [
    {
      title: 'Facility',
      dataIndex: 'facility_name',
      key: 'facility_name',
      sorter: true,
      width: 200,
      render: (value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>ID: {record.facility_id}</Text>
        </Space>
      ),
    },
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      sorter: true,
      width: 150,
      render: (_, record) => `${record.city}, ${record.state}`,
    },
    {
      title: 'Eligible Tenants',
      dataIndex: 'tenants',
      key: 'eligible_tenants',
      sorter: true,
      align: 'center',
      width: 120,
      render: (tenants) => tenants.length || 0,
    },
    {
      title: 'Average Rate Increase %',
      dataIndex: 'avr_rate_increase_percent',
      key: 'avr_rate_increase_percent',
      sorter: true,
      align: 'center',
      width: 150,
      render: (value) => {
        const percentage = value || 0;
        const color = percentage >= 0 ? '#52c41a' : '#ff4d4f';
        const sign = percentage >= 0 ? '+' : '';
        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {sign}
            {percentage.toFixed(2)}%
          </span>
        );
      },
    },
    {
      title: 'Average Rate Change $',
      dataIndex: 'avr_rate_increase_amount',
      key: 'avr_rate_increase_amount',
      sorter: true,
      align: 'center',
      width: 150,
      render: (value) => {
        // Use the actual average rate increase amount from the API
        const avgChange = value || 0;
        const color = avgChange >= 0 ? '#52c41a' : '#ff4d4f';
        const sign = avgChange >= 0 ? '+' : '';
        return (
          <span style={{ color, fontWeight: 'bold' }}>
            {sign}${avgChange.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: 'Largest Increase',
      dataIndex: 'largest_rate_increase',
      key: 'largest_increase',
      sorter: true,
      align: 'center',
      width: 120,
      render: (value) => {
        const amount = value || 0;
        return `$${amount.toFixed(2)}`;
      },
    },
    {
      title: 'Average Move-Out Probability',
      dataIndex: 'avr_moveout_probability',
      key: 'avr_moveout_probability',
      sorter: true,
      align: 'center',
      width: 180,
      render: (value) => {
        const percentage = value * 100 || 0;
        const color = getMoveOutProbabilityColor(percentage);
        return <Tag color={color}>{percentage.toFixed(1)}%</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <FacilityActions
          facility={record}
          isExpanded={expandedRowKeys.includes(record.facility_id)}
          onExpand={handleExpand}
          onClose={handleClose}
          onSaveChanges={handleSaveChanges}
          onPublish={handlePublishIndividual}
          navigate={navigate}
        />
      ),
    },
  ];

  // Handle table sorting
  const handleTableChange = (_, __, sorter) => {
    if (sorter && sorter.field) {
      const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
      onSortChanged(sorter.field, direction);
    }
  };

  // Expanded row render with inline tenant editing
  const expandedRowRender = (record) => {
    return (
      <TenantEditingTable
        facility={record}
        tenants={record.tenants || []}
        onTenantChange={handleTenantChange}
      />
    );
  };

  return (
    <>
      <Table
        columns={columns}
        className="existing-customers-table"
        dataSource={facilities}
        loading={loading}
        bordered
        pagination={pagination}
        onChange={handleTableChange}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender,
        }}
        rowKey="facility_id"
        scroll={{ x: 1200 }}
        locale={{
          emptyText: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                color: '#8c8c8c',
              }}
            >
              <UserOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }} />
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#595959',
                }}
              >
                No Existing Customer Data
              </div>
              <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                Existing customer information will appear here when available.
                <br />
                Try adjusting your search criteria or refresh the data.
              </div>
            </div>
          ),
        }}
      />

      {/* Publish Individual Modal */}
      <Modal
        title={`Publish Rate Changes - ${selectedFacility?.facility_name}`}
        open={publishModalOpen}
        onOk={confirmPublishIndividual}
        onCancel={() => setPublishModalOpen(false)}
        confirmLoading={isSubmittingIndividual}
      >
        <p>Are you sure you want to publish saved rate changes for this facility?</p>
        <p>
          <Text type="secondary">
            {savedTenantChangesForFacility.length} saved changes will be published.
          </Text>
        </p>
      </Modal>
    </>
  );
};

// Separate component for facility actions to use hooks properly
const FacilityActions = ({ facility, isExpanded, onExpand, onClose, onSaveChanges, onPublish }) => {
  const newTenantChanges = useSelector(getNewTenantChanges);
  const hasChanges = newTenantChanges.some((tenant) =>
    facility.tenants?.some((facilityTenant) => facilityTenant.ecri_id === tenant.ecri_id)
  );
  const hasSavedTenantChanges = useSelector((state) =>
    getFacilityHasSavedChanges(state, facility.facility_id)
  );

  return (
    <Flex vertical={true} gap={10} style={{ padding: '0 8px' }}>
      <Button
        size="small"
        onClick={() =>
          isExpanded
            ? hasChanges
              ? onSaveChanges(facility)
              : onClose(facility)
            : onExpand(true, facility)
        }
        variant={isExpanded ? 'solid' : 'outlined'}
        color={isExpanded ? 'danger' : 'default'}
        block
      >
        {isExpanded
          ? hasChanges
            ? 'Save Changes'
            : 'Cancel'
          : hasChanges
            ? 'View Edits'
            : 'Review Increases'}
      </Button>
      {!isExpanded && (
        <Button
          size="small"
          variant="outlined"
          color="default"
          disabled={!isExpanded && !hasSavedTenantChanges}
          onClick={() => onPublish(facility)}
          block
        >
          Publish Rates
        </Button>
      )}
    </Flex>
  );
};

export default ExistingCustomersTable;
