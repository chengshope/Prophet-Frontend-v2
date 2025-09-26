import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, message } from 'antd';
import { useGetUnitTypesQuery, useUpdateUnitTypeMutation } from '@/api/streetRatesApi';
import { selectPmsType } from '@/features/auth/authSelector';
import { updateFacility } from '@/features/streetRates/streetRatesSlice';
import { getUnitTypeStatisticsTableColumns } from '../tableColumns/unitTypeStatisticsTableColumns';
import {
  LinkOrAnchorModal,
  UnitTypeLinkingModal,
  UnitTypeCategoryModal,
  RemoveConfirmModal,
  LockScheduleConfirmModal,
  LockScheduleDateModal,
} from '../Modal';

const UnitTypeStatistics = ({ facilityId, rows, rateType, changedUnits = [] }) => {
  const [editingUnit, setEditingUnit] = useState(null);
  const [linkOrAnchorModalOpen, setLinkOrAnchorModalOpen] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [removeConfirmModalOpen, setRemoveConfirmModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [linkData, setLinkData] = useState({ unitTypeId: null, adjustmentPercentage: 0 });
  const [categoryData, setCategoryData] = useState({ guide: null, variance: 0 });

  const [lockScheduleConfirmModalOpen, setLockScheduleConfirmModalOpen] = useState(false);
  const [lockScheduleModalOpen, setLockScheduleModalOpen] = useState(false);
  const [lockExpirationDate, setLockExpirationDate] = useState(null);
  const [unitToLock, setUnitToLock] = useState(null);

  const dispatch = useDispatch();

  const pmsType = useSelector(selectPmsType);

  const { data: unitTypes, isLoading: unitTypesLoading } = useGetUnitTypesQuery(facilityId);
  const [updateUnitType, { isLoading: isUpdatingUnitType }] = useUpdateUnitTypeMutation();

  const handleRateChange = (unit, newRate) => {
    const updatedUnit = {
      ...unit,
      [rateType === 'street_rate' ? 'new_std_rate' : 'new_web_rate']: newRate,
    };
    dispatch(updateFacility({ facilityId, unit: updatedUnit, newRate: true }));
  };

  const saveUnitTypeLink = async () => {
    if (!selectedUnit || !linkData.unitTypeId) return;

    try {
      await updateUnitType({
        id: selectedUnit.ut_id,
        master_unittype: linkData.unitTypeId,
        exception: true,
        adjustment_percentage: linkData.adjustmentPercentage / 100,
      }).unwrap();

      // Find the selected unit type to get its name
      const selectedUnitType = unitTypes?.find((ut) => ut.id === linkData.unitTypeId);

      const updatedUnit = {
        ...selectedUnit,
        exception: true,
        master_unittype: linkData.unitTypeId,
        master_unittype_name: selectedUnitType?.unit_type || '',
        adjustment_percentage: linkData.adjustmentPercentage / 100,
      };

      dispatch(updateFacility({ facilityId, unit: updatedUnit }));
      setLinkModalOpen(false);
      setSelectedUnit(null);
      message.success('Unit type linked successfully');
    } catch {
      // automatically handled by RTK Query
    }
  };

  const saveUnitTypeCategory = async () => {
    if (!selectedUnit || !categoryData.guide) return;

    try {
      await updateUnitType({
        id: selectedUnit.ut_id,
        exception: true,
        guide: categoryData.guide,
        variance: categoryData.variance / 100,
      }).unwrap();

      const updatedUnit = {
        ...selectedUnit,
        exception: true,
        guide: categoryData.guide,
        variance: categoryData.variance / 100,
      };

      dispatch(updateFacility({ facilityId, unit: updatedUnit }));

      setCategoryModalOpen(false);
      setSelectedUnit(null);
      message.success('Unit type category updated successfully');
    } catch {
      // automatically handled by RTK Query
    }
  };

  const handleRemoveUnitType = async () => {
    if (!selectedUnit) return;

    try {
      await updateUnitType({
        id: selectedUnit.ut_id,
        exception: null,
        guide: null,
        variance: null,
        master_unittype: null,
        adjustment_percentage: 0,
      }).unwrap();

      const updatedUnit = {
        ...selectedUnit,
        exception: null,
        guide: null,
        variance: null,
        master_unittype: null,
        master_unittype_name: null,
        adjustment_percentage: 0,
      };

      dispatch(updateFacility({ facilityId, unit: updatedUnit }));
      setRemoveConfirmModalOpen(false);
      setSelectedUnit(null);
      message.success('Unit type anchor/link removed successfully');
    } catch {
      // automatically handled by RTK Query
      setRemoveConfirmModalOpen(false);
      setSelectedUnit(null);
    }
  };

  const handleLockToggle = (unit, checked) => {
    if (checked) {
      // When locking, ask if they want to schedule expiration
      setUnitToLock(unit);
      setLockScheduleConfirmModalOpen(true);
    } else {
      // When unlocking, just unlock immediately
      handleLockUnitRate(unit, false);
    }
  };

  const handleLockUnitRate = (unit, locked, expirationDate = null) => {
    // Store lock changes locally (no immediate API call)
    const updatedUnit = {
      ...unit,
      locked,
      lock_expiration_date: expirationDate,
    };

    dispatch(updateFacility({ facilityId, unit: updatedUnit }));

    // Reset modal states
    setLockScheduleConfirmModalOpen(false);
    setLockScheduleModalOpen(false);
    setLockExpirationDate(null);
    setUnitToLock(null);
  };

  const handleScheduleLock = () => {
    setLockScheduleConfirmModalOpen(false);
    setLockScheduleModalOpen(true);
  };

  const confirmScheduledLock = () => {
    if (unitToLock) {
      const expirationDate = lockExpirationDate
        ? lockExpirationDate.format('YYYY-MM-DD HH:mm:ss')
        : null;
      handleLockUnitRate(unitToLock, true, expirationDate);
    }
  };

  const columns = getUnitTypeStatisticsTableColumns({
    rateType,
    pmsType,
    changedUnits,
    editingUnit,
    setEditingUnit,
    setSelectedUnit,
    setLinkOrAnchorModalOpen,
    setRemoveConfirmModalOpen,
    handleRateChange,
    handleLockToggle,
    setUnitToLock,
    setLockExpirationDate,
    setLockScheduleModalOpen,
  });

  return (
    <>
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="ut_id"
        pagination={false}
        size="small"
        scroll={{ x: 1200 }}
        locale={{
          emptyText: 'No unit types available for this facility',
        }}
      />

      <LinkOrAnchorModal
        open={linkOrAnchorModalOpen}
        onCancel={() => {
          setLinkOrAnchorModalOpen(false);
          setSelectedUnit(null);
        }}
        onLinkClick={() => {
          setLinkOrAnchorModalOpen(false);
          setLinkModalOpen(true);
        }}
        onAnchorClick={() => {
          setLinkOrAnchorModalOpen(false);
          setCategoryModalOpen(true);
        }}
      />

      <UnitTypeLinkingModal
        open={linkModalOpen}
        onCancel={() => {
          setLinkModalOpen(false);
          setSelectedUnit(null);
        }}
        onConfirm={saveUnitTypeLink}
        linkData={linkData}
        onLinkDataChange={setLinkData}
        selectedUnit={selectedUnit}
        unitTypes={unitTypes}
        loading={isUpdatingUnitType}
        unitTypesLoading={unitTypesLoading}
      />

      <UnitTypeCategoryModal
        open={categoryModalOpen}
        onCancel={() => {
          setCategoryModalOpen(false);
          setSelectedUnit(null);
        }}
        onConfirm={saveUnitTypeCategory}
        categoryData={categoryData}
        onCategoryDataChange={setCategoryData}
        selectedUnit={selectedUnit}
        loading={isUpdatingUnitType}
      />

      <RemoveConfirmModal
        open={removeConfirmModalOpen}
        onCancel={() => {
          setRemoveConfirmModalOpen(false);
          setSelectedUnit(null);
        }}
        onConfirm={handleRemoveUnitType}
        selectedUnit={selectedUnit}
        loading={isUpdatingUnitType}
      />

      <LockScheduleConfirmModal
        open={lockScheduleConfirmModalOpen}
        onCancel={() => {
          setLockScheduleConfirmModalOpen(false);
          setUnitToLock(null);
        }}
        onLockNow={() => {
          if (unitToLock) {
            handleLockUnitRate(unitToLock, true);
          }
        }}
        onSchedule={handleScheduleLock}
        unitToLock={unitToLock}
      />

      <LockScheduleDateModal
        open={lockScheduleModalOpen}
        onCancel={() => {
          setLockScheduleModalOpen(false);
          setLockExpirationDate(null);
          setUnitToLock(null);
        }}
        onConfirm={confirmScheduledLock}
        lockExpirationDate={lockExpirationDate}
        onDateChange={(date) => setLockExpirationDate(date)}
        unitToLock={unitToLock}
      />
    </>
  );
};

export default UnitTypeStatistics;
