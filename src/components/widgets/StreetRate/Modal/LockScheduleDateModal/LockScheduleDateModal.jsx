import { Modal, Button, DatePicker } from 'antd';
import './LockScheduleDateModal.less';

const LockScheduleDateModal = ({ open, onCancel, onConfirm, lockExpirationDate, onDateChange }) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Select Expiration Date"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
      centered
      width={400}
    >
      <div className="lock-date-modal-content">
        <p className="lock-date-modal-description">Choose when this lock should expire:</p>
        <DatePicker
          value={lockExpirationDate}
          onChange={onDateChange}
          placeholder="Select expiration date"
          className="lock-date-picker"
        />
      </div>
    </Modal>
  );
};

export default LockScheduleDateModal;
