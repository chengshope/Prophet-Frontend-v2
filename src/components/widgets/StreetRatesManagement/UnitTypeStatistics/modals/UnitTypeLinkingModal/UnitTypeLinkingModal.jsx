import { Modal, Button, Select, InputNumber, Space } from 'antd';
import { useGetUnitTypesQuery } from '@/api/streetRatesApi';

const UnitTypeLinkingModal = ({
  open,
  onCancel,
  onConfirm,
  linkData,
  onLinkDataChange,
  selectedUnit,
}) => {
  const { data: unitTypes } = useGetUnitTypesQuery();

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Select the unit type to link:"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          CANCEL
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={!linkData.unitTypeId}
        >
          CONFIRM
        </Button>,
      ]}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Unit Type:
          </label>
          <Select
            style={{ width: '100%' }}
            placeholder="Select unit type"
            value={linkData.unitTypeId}
            onChange={(value) => onLinkDataChange({ ...linkData, unitTypeId: value })}
            options={unitTypes?.map((ut) => ({
              value: ut.ut_id,
              label: `${ut.ut_name} (${ut.ut_sqft} sqft)`,
            }))}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Adjustment Percentage:
          </label>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter adjustment percentage"
            value={linkData.adjustmentPercentage}
            onChange={(value) =>
              onLinkDataChange({ ...linkData, adjustmentPercentage: value || 0 })
            }
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
            step={0.1}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default UnitTypeLinkingModal;
