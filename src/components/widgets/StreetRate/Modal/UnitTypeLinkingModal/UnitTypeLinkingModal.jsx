import { Modal, Button, Select, InputNumber, Space } from 'antd';
import './UnitTypeLinkingModal.less';

const UnitTypeLinkingModal = ({
  open,
  onCancel,
  onConfirm,
  linkData,
  onLinkDataChange,
  unitTypes,
  loading = false,
  unitTypesLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Link Unit Type"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={!linkData.unitTypeId}
          loading={loading}
        >
          Confirm
        </Button>,
      ]}
      centered
      width={500}
    >
      <div className="unit-linking-modal-content">
        <p className="unit-linking-modal-description">
          Select the unit type to link and set an adjustment percentage:
        </p>

        <Space direction="vertical" className="unit-linking-form" size="large">
          <div className="form-field">
            <label className="form-label">Unit Type:</label>
            <Select
              className="form-select"
              placeholder="Select unit type"
              value={linkData.unitTypeId}
              onChange={(value) => onLinkDataChange({ ...linkData, unitTypeId: value })}
              loading={unitTypesLoading}
              options={unitTypes?.map((ut) => ({
                value: ut.id,
                label: `${ut.unit_type} - Floor number: ${ut.floor !== null ? ut.floor : '---'} (${ut.area || 0} sqft)`,
              }))}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Adjustment Percentage:</label>
            <InputNumber
              className="form-input"
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
      </div>
    </Modal>
  );
};

export default UnitTypeLinkingModal;
