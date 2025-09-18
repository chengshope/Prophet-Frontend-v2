import { Modal, Button } from 'antd';

const RemoveConfirmModal = ({ open, onCancel, onConfirm, selectedUnit }) => {
  return (
    <Modal
      title="Remove Unit Type Anchor"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="no" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="yes" type="primary" danger onClick={onConfirm}>
          Remove
        </Button>,
      ]}
      centered
    >
      <p>
        Are you sure you want to remove the anchor/link for <strong>{selectedUnit?.ut_name}</strong>
        ?
      </p>
      <p>This will reset it to use its own rates.</p>
    </Modal>
  );
};

export default RemoveConfirmModal;
