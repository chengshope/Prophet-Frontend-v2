import { DollarOutlined } from '@ant-design/icons';
import { Card, Col, message, Modal, Row, Table } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useSaveRateChangesMutation, useSubmitIndividualRatesMutation } from '@/api/streetRatesApi';
import {
  getChangedUnits,
  getChangedUnitsByFacilityId,
  selectNewRateUnits,
  selectSavedRateUnits,
  selectStreetRatesFacilities,
} from '@/features/streetRates/streetRatesSelector';
import {
  clearChangedUnitByFacilityId,
  clearSavedRateChangesByIds,
  mergeToSavedRateChanges,
} from '@/features/streetRates/streetRatesSlice';
import {
  mergeSavedRateUnits,
  removeSavedRateUnitsByIds,
  setSavedRateUnits,
} from '@/utils/localStorage';
import { getRateType } from '@/utils/rateHelper';
import { getStreetRateTableColumns } from '../tableColumns';
import UnitTypeStatistics from '../UnitTypeStatistics';
import './StreetRatesTable.less';

const StreetRatesTable = ({
  loading,
  onSortChanged,
  pagination,
  portfolioSettings,
  latestPublishedDate,
  savedRateChangedUnitsCount,
}) => {
  const facilities = useSelector(selectStreetRatesFacilities);
  const dispatch = useDispatch();

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const changedUnitsByFacility = useSelector(getChangedUnitsByFacilityId);
  const changedUnits = useSelector(getChangedUnits);
  const newRateUnits = useSelector(selectNewRateUnits);
  const savedRateUnits = useSelector(selectSavedRateUnits);

  const [submitIndividualRates, { isLoading: isSubmittingIndividual }] =
    useSubmitIndividualRatesMutation();
  const [saveRateChanges, { isLoading: isSavingChanges }] = useSaveRateChangesMutation();

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.id));
    }
  };

  const handleSaveChanges = async (facility) => {
    try {
      // Get all changed units for this facility
      const facilityChangedUnits = changedUnitsByFacility[facility.facility_id] || [];

      // Save ALL changes to backend (rates + locks + other changes)
      await saveRateChanges({
        facilityId: facility.facility_id,
        units: facilityChangedUnits,
      }).unwrap();

      // After successful save, move ONLY rate changes to saved state for publishing
      const facilityRateChangedUnits = newRateUnits.filter(
        (unit) => unit.facility_id === facility.facility_id
      );

      if (facilityRateChangedUnits.length > 0) {
        // Merge rate changes to localStorage and RTK state
        const updatedSavedUnits = mergeSavedRateUnits(facilityRateChangedUnits);
        dispatch(mergeToSavedRateChanges(facilityRateChangedUnits));

        // Update localStorage with the merged data
        setSavedRateUnits(updatedSavedUnits);
      }

      // Clear all changes for this facility from RTK state
      dispatch(clearChangedUnitByFacilityId(facility.facility_id));

      message.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving rate changes:', error);
      message.error('Failed to save rate changes');
      // Keep unsaved changes in state for retry
    }
  };

  const handleClose = (facility) => {
    // Just close without saving
    setExpandedRowKeys(expandedRowKeys.filter((key) => key !== facility.id));
  };

  const handlePublishIndividual = (facility) => {
    setSelectedFacility(facility);
    setPublishModalOpen(true);
  };

  const confirmPublishIndividual = async () => {
    if (!selectedFacility) return;

    try {
      // Get only SAVED rate changes for this facility
      const facilitySavedRateChangedUnits = savedRateUnits.filter(
        (unit) => unit.facility_id === selectedFacility.facility_id
      );

      if (facilitySavedRateChangedUnits.length === 0) {
        message.warning(
          'No saved rate changes to publish for this facility. Please save changes first.'
        );
        setPublishModalOpen(false);
        setSelectedFacility(null);
        return;
      }

      await submitIndividualRates({
        facilityId: selectedFacility.facility_id,
        changedUnitStatistics: facilitySavedRateChangedUnits,
      }).unwrap();

      message.success(`Rates published successfully for ${selectedFacility.facility_name}`);
      setPublishModalOpen(false);
      setSelectedFacility(null);

      // Remove published units from saved rate changes (localStorage and RTK state)
      const publishedUnitIds = facilitySavedRateChangedUnits.map((unit) => unit.ut_id);
      removeSavedRateUnitsByIds(publishedUnitIds);
      dispatch(clearSavedRateChangesByIds(publishedUnitIds));
    } catch (error) {
      console.log(error);
      message.error('Failed to publish rates');
    }
  };

  const columns = getStreetRateTableColumns({
    expandedRowKeys,
    changedUnits,
    savedRateUnits,
    handleSaveChanges,
    handleClose,
    handleExpand,
    handlePublishIndividual,
    isSavingChanges,
  });

  const handleTableChange = (_, __, sorter) => {
    if (sorter && sorter.field) {
      const direction = sorter.order === 'ascend' ? 'asc' : 'desc';
      onSortChanged(sorter.field, direction);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={facilities}
        loading={loading}
        rowKey={(record) => record.id || record.facility_id}
        pagination={pagination}
        scroll={{ x: 900 }}
        bordered
        onChange={handleTableChange}
        className="street-rates-table"
        title={() => (
          <Row justify="space-between" className="street-rates-status-row">
            <Col>
              {latestPublishedDate ? `Last Updated: ${latestPublishedDate}` : 'No updates yet'}
            </Col>
            <Col>Rate Changes Ready to Publish: {savedRateChangedUnitsCount}</Col>
          </Row>
        )}
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender: (record) => (
            <Card styles={{ body: { padding: 0 } }}>
              <UnitTypeStatistics
                facilityId={record.facility_id}
                rows={record.units_statistics || []}
                rateType={getRateType(record, portfolioSettings)}
                changedUnits={changedUnits}
                streetRateSettings={portfolioSettings?.street_rate_settings}
              />
            </Card>
          ),
          rowExpandable: (record) => record.units_statistics && record.units_statistics.length > 0,
        }}
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
              <DollarOutlined
                style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
              />
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: '#595959',
                }}
              >
                No Street Rate Data
              </div>
              <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                Street rate information will appear here when available.
                <br />
                Check your facility selection or refresh the data.
              </div>
            </div>
          ),
        }}
      />

      <Modal
        title={`Publish Rates - ${selectedFacility?.facility_name}`}
        open={publishModalOpen}
        onOk={confirmPublishIndividual}
        onCancel={() => {
          setPublishModalOpen(false);
          setSelectedFacility(null);
        }}
        confirmLoading={isSubmittingIndividual}
        okText="Publish"
        cancelText="Cancel"
      >
        <p>Are you sure you want to publish the new rates for this facility?</p>
        {selectedFacility && (
          <p>
            This will update rates for{' '}
            {
              savedRateUnits.filter((unit) => unit.facility_id === selectedFacility.facility_id)
                .length
            }{' '}
            unit types.
          </p>
        )}
      </Modal>
    </>
  );
};

export default StreetRatesTable;
