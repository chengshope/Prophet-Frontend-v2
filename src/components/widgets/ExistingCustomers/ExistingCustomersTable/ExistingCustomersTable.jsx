import { useState, useMemo } from 'react';
import { Table, Modal, message, Typography, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  usePublishIndividualRateChangesMutation,
  useBulkUpdateTenantsMutation,
} from '@/api/existingCustomersApi';
import {
  selectExistingCustomersFacilities,
  selectSavedTenantChanges,
  selectExpandedRowKeys,
  selectSelectedFacility,
  getChangedTenantsByFacilityId,
  selectNewTenantChanges,
} from '@/features/existingCustomers/existingCustomersSelector';
import {
  clearSavedTenantChangesByIds,
  clearChangedTenantsByFacilityId,
  mergeToSavedTenantChanges,
  updateTenant,
  setExpandedRowKeys,
  setSelectedFacility,
} from '@/features/existingCustomers/existingCustomersSlice';
import {
  removeSavedTenantChangesByIds,
  mergeSavedTenantChanges,
  setSavedTenantChanges,
} from '@/utils/localStorage';
import { getExistingCustomersTableColumns } from '../tableColumns';
import TenantEditingTable from '../TenantEditingTable';
import './ExistingCustomersTable.less';

const { Text } = Typography;

const ExistingCustomersTable = ({
  loading,
  onSortChanged,
  pagination,
  latestPublishedDate,
  savedChangesCount,
}) => {
  // modal state (local to this component)
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // Redux selectors - using centralized state
  const facilities = useSelector(selectExistingCustomersFacilities);
  const expandedRowKeys = useSelector(selectExpandedRowKeys);
  const selectedFacility = useSelector(selectSelectedFacility);
  const changedTenantsByFacility = useSelector(getChangedTenantsByFacilityId);
  const newTenantChanges = useSelector(selectNewTenantChanges);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [publishIndividualRateChanges, { isLoading: isSubmittingIndividual }] =
    usePublishIndividualRateChangesMutation();
  const [bulkUpdateTenants] = useBulkUpdateTenantsMutation();

  // Handle row expansion using Redux
  const handleExpand = (expanded, record) => {
    if (expanded) {
      dispatch(setExpandedRowKeys([...expandedRowKeys, record.facility_id]));
    } else {
      dispatch(setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.facility_id)));
    }
  };

  // Handle close expanded row
  const handleClose = (facility) => {
    dispatch(setExpandedRowKeys(expandedRowKeys.filter((key) => key !== facility.facility_id)));
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

  // Get saved tenant changes for selected facility using memoized selector
  const savedTenantChanges = useSelector(selectSavedTenantChanges);
  const savedTenantChangesForFacility = useMemo(() => {
    if (!selectedFacility) return [];
    return savedTenantChanges.filter(
      (tenant) => tenant.facility_id === selectedFacility.facility_id
    );
  }, [savedTenantChanges, selectedFacility]);

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

  // Get table columns using extracted function
  const columns = getExistingCustomersTableColumns({
    expandedRowKeys,
    onExpand: handleExpand,
    onClose: handleClose,
    onSaveChanges: handleSaveChanges,
    onPublish: handlePublishIndividual,
    navigate,
  });

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
        title={() => (
          <Row justify="space-between" className="existing-customers-status-row">
            <Col>
              {latestPublishedDate ? `Last Updated: ${latestPublishedDate}` : 'No updates yet'}
            </Col>
            <Col>Rate Changes Ready to Publish: {savedChangesCount || 0}</Col>
          </Row>
        )}
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

export default ExistingCustomersTable;
