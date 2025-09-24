import { Table, Collapse, Card, Flex } from 'antd';
import { useState, useEffect } from 'react';
import { getTenantEditingTableColumns } from '../tableColumns';
import './TenantEditingTable.less';

const TenantEditingTable = ({ facility, tenants, onTenantChange }) => {
  const [editingTenants, setEditingTenants] = useState({});
  const [editingTenantId, setEditingTenantId] = useState(null);

  // Separate tenants into included and excluded
  const includedTenants = tenants.filter((tenant) => !tenant.exclude_submit);
  const excludedTenants = tenants.filter((tenant) => tenant.exclude_submit);

  // Initialize editing state for tenants
  useEffect(() => {
    const initialEditingState = {};
    tenants.forEach((tenant) => {
      initialEditingState[tenant.ecri_id] = {
        new_rate: tenant.new_rate || tenant.current_rate,
        exclude_submit: tenant.exclude_submit || false,
      };
    });
    setEditingTenants(initialEditingState);
  }, [tenants]);

  // Handle field changes
  const handleFieldChange = (tenant, field, value) => {
    const updatedEditingState = {
      ...editingTenants,
      [tenant.ecri_id]: {
        ...editingTenants[tenant.ecri_id],
        [field]: value,
      },
    };
    setEditingTenants(updatedEditingState);

    // Create updated tenant object
    const updatedTenant = {
      ...tenant,
      ...updatedEditingState[tenant.ecri_id],
    };

    // Notify parent component
    onTenantChange(facility.facility_id, updatedTenant, field, value);
  };

  // Get table columns using extracted function
  const tenantColumns = getTenantEditingTableColumns({
    editingTenants,
    editingTenantId,
    setEditingTenantId,
    handleFieldChange,
  });

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <Flex vertical={true} gap={0}>
        <Table
          columns={tenantColumns}
          dataSource={includedTenants}
          pagination={false}
          rowKey="ecri_id"
          scroll={{ x: 1400 }}
          rowClassName={(record) => {
            // Highlight rows that have been modified
            const editingState = editingTenants[record.ecri_id];
            if (editingState) {
              const hasChanges =
                editingState.new_rate !== record.current_rate ||
                editingState.exclude_submit !== (record.exclude_submit || false);
              return hasChanges ? 'tenant-row-modified' : '';
            }
            return '';
          }}
        />

        {/* Excluded tenants in collapsible section */}
        {excludedTenants.length > 0 && (
          <Collapse
            size="small"
            className="exclude-wrap"
            ghost
            items={[
              {
                key: 'excluded',
                label: `Excluded Units (${excludedTenants.length})`,
                children: (
                  <Table
                    columns={tenantColumns}
                    dataSource={excludedTenants}
                    showHeader={false}
                    pagination={false}
                    size="small"
                    rowKey="ecri_id"
                    scroll={{ x: 1400 }}
                    rowClassName={() => 'excluded-tenant-row'}
                    style={{ backgroundColor: '#f9f9f9' }}
                  />
                ),
              },
            ]}
          />
        )}
      </Flex>
    </Card>
  );
};

export default TenantEditingTable;
