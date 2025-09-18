import { Modal, Button, Typography } from 'antd';

const { Text } = Typography;

const LockScheduleConfirmModal = ({ open, onCancel, onSchedule, onLockNow, unitToLock }) => {
  return (
    <Modal
      title="Schedule expiration?"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onLockNow}>
          NO
        </Button>,
        <Button key="yes" type="primary" onClick={onSchedule}>
          YES
        </Button>,
      ]}
      centered
    >
      <Text>Do you want to schedule an expiration date for this lock?</Text>
    </Modal>
  );
};

export default LockScheduleConfirmModal;
