import { Layout, Spin } from 'antd';
import './LoadingSpinner.less';

const { Content } = Layout;

const LoadingSpinner = ({ tip = 'Loading...' }) => {
  return (
    <Layout className="loading-page">
      <Content className="spinner-container">
        <Spin size="large" tip={tip} />
      </Content>
    </Layout>
  );
};

export default LoadingSpinner;
