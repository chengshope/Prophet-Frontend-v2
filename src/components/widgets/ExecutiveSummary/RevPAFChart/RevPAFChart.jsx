import { useMemo } from 'react';
import { Col } from 'antd';
import LineChart from '@/components/common/LineChart';
import { useGetRevPAFOverTimeQuery } from '@/api/reportingApi';
import { formatRevPAF } from '../ExecutiveSummaryTab/utils';

const RevPAFChart = ({ apiParams }) => {
  const {
    data: revPAFOverTime,
    isLoading: loadingRevPAFChart,
    isFetching: fetchingRevPAFChart,
  } = useGetRevPAFOverTimeQuery(apiParams);

  // Format data for chart
  const formattedRevPAFData = useMemo(() => {
    console.log('RevPAFChart - Raw API response:', revPAFOverTime);
    const revPAFData = revPAFOverTime?.data?.data || revPAFOverTime?.data || [];
    console.log('RevPAFChart - Extracted data:', revPAFData);

    return Array.isArray(revPAFData)
      ? revPAFData.map((item) => {
          console.log('RevPAFChart - Processing item:', item);
          return {
            date: item.date,
            revpaf: item.revpaf || 0,
            formattedDate: item.formatted_date,
          };
        })
      : [];
  }, [revPAFOverTime]);

  return (
    <Col xs={24} lg={12}>
      <LineChart
        data={formattedRevPAFData}
        dataKey="revpaf"
        title="RevPAF Over Time"
        color="#722ed1"
        formatter={formatRevPAF}
        tooltipLabel="RevPAF"
        domain={[0, 'dataMax + 0.5']}
        loading={loadingRevPAFChart || fetchingRevPAFChart}
      />
    </Col>
  );
};

export default RevPAFChart;
