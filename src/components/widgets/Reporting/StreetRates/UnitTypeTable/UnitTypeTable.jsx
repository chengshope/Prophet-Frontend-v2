import { Table, Card, Alert } from 'antd';
import { useGetUnitTypeAnalysisQuery } from '@/api/reportingApi';
import { getUnitTypeColumns, transformUnitTypeData } from '../../tableColumns/unitTypeColumns';

const UnitTypeTable = ({ apiParams }) => {
  const {
    data: unitTypeAnalysis,
    isLoading,
    isFetching,
    error,
  } = useGetUnitTypeAnalysisQuery(apiParams, {
    skip: !apiParams,
  });

  const tableData = transformUnitTypeData(unitTypeAnalysis);
  const columns = getUnitTypeColumns();

  if (error) {
    return (
      <Card>
        <Alert
          message="Error Loading Data"
          description="Unable to load unit type analysis data. Please try again."
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      bordered
      loading={isLoading || isFetching}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: 'max-content' }}
      size={'middle'}
      rowKey="key"
    />
  );
};

export default UnitTypeTable;
