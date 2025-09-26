import { Spin } from 'antd';
import './SuspenseLoading.less';

const SuspenseLoading = () => {
  return (
    <div className="suspense-loading-wrapper">
      <Spin />
    </div>
  );
};

export default SuspenseLoading;
