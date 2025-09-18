import { Modal, Button } from 'antd';

const RemoveConfirmModal = ({ open, onCancel, onConfirm, selectedUnit }) => {
  return (
    <Modal
      title="Are you sure you want to remove this unit type anchor?"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onCancel}>
          NO
        </Button>,
        <Button key="yes" type="primary" danger onClick={onConfirm}>
          YES
        </Button>,
      ]}
      centered
    >
      <p>
        This will remove the anchor/link for <strong>{selectedUnit?.ut_name}</strong> and reset it
        to use its own rates.
      </p>
    </Modal>
  );
};

export default RemoveConfirmModal;
