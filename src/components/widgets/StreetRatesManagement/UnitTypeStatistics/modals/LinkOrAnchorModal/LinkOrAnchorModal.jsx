import { Modal, Button, Space } from 'antd';

const LinkOrAnchorModal = ({ open, onCancel, onLinkClick, onAnchorClick }) => {
  return (
    <Modal title="Link or Anchor Unit?" open={open} onCancel={onCancel} footer={null} centered>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Space size="large">
          <Button
            type="default"
            size="large"
            onClick={onLinkClick}
            style={{
              minWidth: '100px',
              borderColor: '#ff4d4f',
              color: '#ff4d4f',
            }}
          >
            LINK
          </Button>
          <Button
            type="default"
            size="large"
            onClick={onAnchorClick}
            style={{
              minWidth: '100px',
              borderColor: '#ff4d4f',
              color: '#ff4d4f',
            }}
          >
            ANCHOR
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default LinkOrAnchorModal;
