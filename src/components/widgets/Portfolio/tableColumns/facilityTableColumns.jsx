import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const getFacilityTableColumns = (onStorTrackLookup) => [
  {
    title: '#',
    key: 'index',
    render: (_, __, index) => index + 1,
    width: 60,
    align: 'center',
  },
  {
    title: 'Facility Name',
    dataIndex: 'facility_name',
    key: 'facility_name',
  },
  {
    title: 'StorTrack Store Name',
    key: 'stortrack_name',
    render: (_, record) => record.comp_stores_info?.store_name || '-',
  },
  {
    title: 'Competitor Radius',
    key: 'radius',
    render: (_, record) => record.comp_stores_info?.distance || '-',
  },
  {
    title: 'Store Lookup',
    key: 'lookup',
    width: 150,
    align: 'center',
    render: (_, record) => (
      <Button
        variant="dashed"
        color="blue"
        size="small"
        shape="circle"
        icon={<SearchOutlined />}
        onClick={() => onStorTrackLookup(record)}
        title="Lookup StorTrack"
      />
    ),
  },
];
