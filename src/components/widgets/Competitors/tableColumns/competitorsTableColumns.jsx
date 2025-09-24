import { Tag } from 'antd';
import CompetitorTypeSelect from '../CompetitorTypeSelect';

export const getCompetitorsTableColumns = ({ onCompetitorTypeChange }) => [
  {
    title: '',
    dataIndex: 'comp_type',
    key: 'warning',
    width: 40,
    render: (val) =>
      !val ? (
        <Tag color="red" style={{ margin: 0 }}>
          !
        </Tag>
      ) : null,
  },
  {
    title: 'Competitor',
    dataIndex: 'store_name',
    key: 'store_name',
    sorter: (a, b) => (a.store_name || '').localeCompare(b.store_name || ''),
    render: (_, record) => (
      <a
        href={record.source_url}
        target="_blank"
        rel="noreferrer"
        style={{ color: 'var(--ant-color-primary)' }}
      >
        {record.store_name} {record.address}
      </a>
    ),
  },
  {
    title: 'Distance (Miles)',
    dataIndex: 'distance',
    key: 'distance',
    sorter: (a, b) => (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0),
    render: (distance) => (distance ? `${distance}` : '-'),
  },
  {
    title: 'Type',
    dataIndex: 'comp_type',
    key: 'comp_type',
    render: (value, record) => (
      <CompetitorTypeSelect
        selected={value}
        onChange={(newType) => onCompetitorTypeChange(record.id, newType)}
      />
    ),
  },
];
