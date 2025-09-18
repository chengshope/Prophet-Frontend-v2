import { Modal } from 'antd';

const PublishConfirmModal = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  savedRateChangedUnitsCount,
}) => {
  return (
    <Modal
      title="Publish New Rates"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Publish"
      cancelText="Cancel"
      centered
    >
      <p>Are you sure you want to publish the new street rates?</p>
      <p>
        This will update rates for {savedRateChangedUnitsCount} saved unit types across all
        facilities.
      </p>
    </Modal>
  );
};

export default PublishConfirmModal;
