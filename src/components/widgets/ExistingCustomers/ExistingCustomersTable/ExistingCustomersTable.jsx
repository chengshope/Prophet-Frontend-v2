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
  getChangedTenantsByFacilityId,
  selectNewTenantChanges,
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
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilities = useSelector(selectExistingCustomersFacilities);
  const changedTenantsByFacility = useSelector(getChangedTenantsByFacilityId);
  const newTenantChanges = useSelector(selectNewTenantChanges);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [publishIndividualRateChanges, { isLoading: isSubmittingIndividual }] =
    usePublishIndividualRateChangesMutation();
  const [bulkUpdateTenants] = useBulkUpdateTenantsMutation();

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.facility_id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.facility_id));
    }
  };

  const handleClose = (facility) => {
    setExpandedRowKeys(expandedRowKeys.filter((key) => key !== facility.facility_id));
  };

  const handleSaveChanges = async (facility) => {
    try {
      // Get all changed tenants for this facility
      const facilityChangedTenants = changedTenantsByFacility[facility.facility_id] || [];

      if (facilityChangedTenants.length === 0) {
        message.warning('No changes to save for this facility');
        return;
      }

      // Prepare data for bulk update
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
    }
  };

  const handlePublishIndividual = (facility) => {
    setSelectedFacility(facility);
    setPublishModalOpen(true);
  };

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
      setPublishModalOpen(false);
    }
  };

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

  const columns = getExistingCustomersTableColumns({
    expandedRowKeys,
    onExpand: handleExpand,
    onClose: handleClose,
    onSaveChanges: handleSaveChanges,
    onPublish: handlePublishIndividual,
    navigate,
  });

  const handleTableChange = (_, __, sorter) => {
    if (sorter && sorter.field) {
      const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
      onSortChanged(sorter.field, direction);
    }
  };

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
