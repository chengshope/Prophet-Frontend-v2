import { Modal, Button } from 'antd';
import './ErrorModal.less';

const ErrorModal = ({ open, onCancel, errorLog }) => {
  return (
    <Modal
      title="Error Alert"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      centered
    >
      <div className="error-modal-message">
        There was an error publishing your rates. Please try again later or reach out to our
        Customer Success team for more information.
      </div>
      {errorLog && <div className="error-modal-log">{errorLog}</div>}
    </Modal>
  );
};

export default ErrorModal;
