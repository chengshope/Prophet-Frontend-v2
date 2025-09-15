import { Card, Skeleton } from 'antd';

const ChartSkeleton = ({ title = 'Loading Chart...', height = 400, style = {}, ...props }) => {
  return (
    <Card title={title} style={{ height: '100%', ...style }} {...props}>
      <Skeleton.Node active style={{ width: '100%', height: `${height - 100}px` }}>
        <div
          style={{ width: '100%', height: '100%', backgroundColor: '#f5f5f5', borderRadius: '6px' }}
        />
      </Skeleton.Node>
    </Card>
  );
};

export default ChartSkeleton;
