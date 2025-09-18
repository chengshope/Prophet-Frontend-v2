import { Modal, Button, InputNumber, Space, Typography } from 'antd';

const { Text } = Typography;

const UnitTypeCategoryModal = ({
  open,
  onCancel,
  onConfirm,
  categoryData,
  onCategoryDataChange,
  selectedUnit,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Please select the unit category you'd like to anchor this unit type to:"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          CANCEL
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleConfirm}
          disabled={!categoryData.guide}
          style={{
            backgroundColor: '#ff4d4f',
            borderColor: '#ff4d4f',
          }}
        >
          SAVE
        </Button>,
      ]}
      centered
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap>
          <Button
            type={categoryData.guide === 'Drive Up' ? 'primary' : 'default'}
            onClick={() => onCategoryDataChange({ ...categoryData, guide: 'Drive Up' })}
          >
            Drive Up
          </Button>
          <Button
            type={categoryData.guide === 'Climate Controlled' ? 'primary' : 'default'}
            onClick={() => onCategoryDataChange({ ...categoryData, guide: 'Climate Controlled' })}
          >
            Climate Controlled
          </Button>
          <Button
            type={categoryData.guide === 'Parking' ? 'primary' : 'default'}
            onClick={() => onCategoryDataChange({ ...categoryData, guide: 'Parking' })}
          >
            Parking
          </Button>
        </Space>

        <div style={{ marginTop: '20px' }}>
          <Text strong>Input your adjustment percentage:</Text>
          <InputNumber
            style={{ width: '100%', marginTop: 8 }}
            placeholder="5%"
            value={categoryData.variance}
            onChange={(value) => onCategoryDataChange({ ...categoryData, variance: value || 0 })}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
          />
        </div>
      </Space>
    </Modal>
  );
};

export default UnitTypeCategoryModal;
