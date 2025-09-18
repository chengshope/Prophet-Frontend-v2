import { Modal, Button, InputNumber, Space, Typography } from 'antd';
import './UnitTypeCategoryModal.less';

const { Text } = Typography;

const UnitTypeCategoryModal = ({
  open,
  onCancel,
  onConfirm,
  categoryData,
  onCategoryDataChange,
  loading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Select Unit Category"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleConfirm}
          disabled={!categoryData.guide}
          loading={loading}
        >
          Save
        </Button>,
      ]}
      centered
      width={500}
    >
      <div className="unit-category-modal-content">
        <p className="unit-category-modal-description">
          Please select the unit category you'd like to anchor this unit type to:
        </p>

        <Space wrap className="unit-category-buttons">
          <Button
            type={categoryData.guide === 'Drive Up' ? 'primary' : 'default'}
            onClick={() => onCategoryDataChange({ ...categoryData, guide: 'Drive Up' })}
            className="category-button"
          >
            Drive Up
          </Button>
          <Button
            type={categoryData.guide === 'Climate Controlled' ? 'primary' : 'default'}
            onClick={() => onCategoryDataChange({ ...categoryData, guide: 'Climate Controlled' })}
            className="category-button"
          >
            Climate Controlled
          </Button>
          <Button
            type={categoryData.guide === 'Parking' ? 'primary' : 'default'}
            onClick={() => onCategoryDataChange({ ...categoryData, guide: 'Parking' })}
            className="category-button"
          >
            Parking
          </Button>
        </Space>

        <div className="adjustment-section">
          <Text strong>Input your adjustment percentage:</Text>
          <InputNumber
            className="adjustment-input"
            placeholder="5%"
            value={categoryData.variance}
            onChange={(value) => onCategoryDataChange({ ...categoryData, variance: value || 0 })}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
        </div>
      </div>
    </Modal>
  );
};

export default UnitTypeCategoryModal;
