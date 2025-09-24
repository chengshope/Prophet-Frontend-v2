import { Modal, Button } from 'antd';

const ErrorModal = ({ open, onOk, onCancel, errorLog = '' }) => {
  return (
    <Modal
      title="Error"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="ok" type="primary" onClick={onOk}>
          OK
        </Button>,
      ]}
    >
      <p>{errorLog}</p>
    </Modal>
  );
};

export default ErrorModal;
