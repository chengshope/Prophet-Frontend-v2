import { Spin, Layout } from 'antd';

const { Content } = Layout;

const LoadingSpinner = ({ tip = 'Loading...' }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size='large' tip={tip} />
      </Content>
    </Layout>
  );
};

export default LoadingSpinner;
