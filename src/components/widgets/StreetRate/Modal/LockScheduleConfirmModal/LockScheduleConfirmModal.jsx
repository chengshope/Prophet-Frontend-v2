import { Modal, Button } from 'antd';

const LockScheduleConfirmModal = ({ open, onCancel, onSchedule, onLockNow }) => {
  return (
    <Modal
      title="Schedule Expiration"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onLockNow}>
          Lock Now
        </Button>,
        <Button key="yes" type="primary" onClick={onSchedule}>
          Schedule
        </Button>,
      ]}
      centered
    >
      <p>Do you want to schedule an expiration date for this lock?</p>
    </Modal>
  );
};

export default LockScheduleConfirmModal;
