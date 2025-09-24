import { Table } from 'antd';
import { useUpdateCompetitorMutation } from '@/api/competitorsApi';
import { getCompetitorsTableColumns } from '../tableColumns';
import { ShopOutlined } from '@ant-design/icons';

const CompetitorsTable = ({ data, loading, onCompetitorUpdate, onRowHover }) => {
  const [updateCompetitor] = useUpdateCompetitorMutation();

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

  // Get table columns using extracted function
  const columns = getCompetitorsTableColumns({
    onCompetitorTypeChange: handleCompetitorTypeChange,
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        size='small'
        rowKey="id"
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
              <ShopOutlined
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  color: 'var(--ant-color-text-quaternary)',
                }}
              />
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
