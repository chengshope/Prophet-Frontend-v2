import { Table, Card, Alert } from 'antd';
import { useGetExistingCustomersReportQuery } from '@/api/reportingApi';
import { existingRatesColumns as columns } from '../../tableColumns/existingRatesColumns';
import { sanitizeTableData } from '@/utils/reportingHelpers';

const ExistingRatesTable = ({ apiParams }) => {
  const {
    data: reportData,
    isLoading,
    isFetching,
    error,
  } = useGetExistingCustomersReportQuery(apiParams, {
    skip: !apiParams,
  });

  const rawData = reportData?.data || reportData || [];
  const transformedData = Array.isArray(rawData)
    ? rawData.map((item, index) => ({
        key: index,
        month: item.month_date
          ? new Date(item.month_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
            })
          : '',
        totalIncreases: item.total_increases || 0,
        totalOccupiedUnits: item.total_occupied_units || 0,
        ecriPercentage: item.ecri_percentage
          ? `${(item.ecri_percentage * 100).toFixed(2)}%`
          : '0.00%',
        totalRevenueIncrease: item.total_revenue_increase || 0,
        avgMoveOutProbability: item.avg_move_out_probability
          ? `${(item.avg_move_out_probability * 100).toFixed(2)}%`
          : '0.00%',
        ecriMoveOuts: item.ecri_move_outs || 0,
      }))
    : [];

  const tableData = sanitizeTableData(transformedData);

  if (error) {
    return (
      <Card>
        <Alert
          message="Error Loading Data"
          description="Unable to load existing rates report data. Please try again."
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
      loading={isLoading || isFetching}
      bordered
      pagination={{
        pageSize: 50,
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

export default ExistingRatesTable;
