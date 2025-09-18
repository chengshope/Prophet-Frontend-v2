import { Modal, Button, DatePicker } from 'antd';

const LockScheduleDateModal = ({
  open,
  onCancel,
  onConfirm,
  lockExpirationDate,
  onDateChange,
  unitToLock,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Select expiration date"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          CANCEL
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          CONFIRM
        </Button>,
      ]}
      centered
    >
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <DatePicker
          value={lockExpirationDate}
          onChange={onDateChange}
          placeholder="Select expiration date"
          style={{ width: '100%' }}
        />
      </div>
    </Modal>
  );
};

export default LockScheduleDateModal;
