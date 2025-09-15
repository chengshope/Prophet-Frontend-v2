import { Card, Skeleton, Statistic } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import './MetricCardAntd.less';

const MetricCard = ({
  title,
  value,
  date,
  change,
  changeType = 'neutral',
  loading = false,
  style = {},
  ...props
}) => {
  if (loading) {
    return (
      <Card style={style} {...props}>
        <Skeleton active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
      case 'negative':
        return <ArrowDownOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return '#52c41a';
      case 'negative':
        return '#ff4d4f';
      default:
        return '#8c8c8c';
    }
  };

  return (
    <Card className="metric-card" style={style} {...props}>
      <Statistic
        title={title}
        value={value}
        valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
      />
      {date && (
        <div
          className="metric-date"
          style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '4px' }}
        >
          {date}
        </div>
      )}
      {change && (
        <div className="metric-change" style={{ marginTop: '8px' }}>
          <span style={{ color: getChangeColor(), fontSize: '14px' }}>
            {getChangeIcon()} {change}
          </span>
        </div>
      )}
    </Card>
  );
};

export default MetricCard;
