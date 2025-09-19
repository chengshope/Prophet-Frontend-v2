/**
 * CompetitorsTable Component
 * Following Rule #4: components/widgets/Competitors/CompetitorsTable
 * Matching v1 table structure with warning icons, competitor types, and proper columns
 */

import { useMemo } from 'react';
import { Table, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useUpdateCompetitorMutation } from '@/api/competitorsApi';
import CompetitorTypeSelect from '../CompetitorTypeSelect';
import { ShopOutlined } from '@ant-design/icons';

const CompetitorsTable = ({ data, loading, onCompetitorUpdate, onRowHover }) => {
  const [updateCompetitor] = useUpdateCompetitorMutation();

  // Handle competitor type change (matching v1)
  const handleCompetitorTypeChange = async (competitorId, newType) => {
    try {
      await updateCompetitor({
        competitorId,
        comp_type: newType,
      }).unwrap();

      if (onCompetitorUpdate) {
        onCompetitorUpdate();
      }
    } catch (error) {
      // Error handling is automatic with RTK Query
      console.error('Failed to update competitor type:', error);
    }
  };

  // Table columns matching v1 structure exactly
  const columns = useMemo(
    () => [
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
          <a href={record.source_url} target="_blank" rel="noreferrer" style={{ color: 'var(--ant-color-primary)' }}>
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
            onChange={(newType) => handleCompetitorTypeChange(record.id, newType)}
          />
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        size="small"
        bordered
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} competitors`,
        }}
        onRow={(record) => ({
          onMouseEnter: () => {
            if (onRowHover) {
              onRowHover(record);
            }
          },
          // Removed onMouseLeave from individual rows for better UX
        })}
        locale={{
          emptyText: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '40px 20px',
                color: 'var(--ant-color-text-tertiary)',
              }}
            >
              <ShopOutlined style={{ fontSize: '48px', marginBottom: '16px', color: 'var(--ant-color-text-quaternary)' }} />
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '8px',
                  color: 'var(--ant-color-text-secondary)',
                }}
              >
                No Competitors Found
              </div>
              <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                Competitor information will appear here when available.
                <br />
                Try adjusting your search criteria or check back later.
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default CompetitorsTable;
