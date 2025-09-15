import { Row, Col } from 'antd';
import MetricCard from '@/components/common/MetricCard';
import {
  useGetGrossRentalRevenueQuery,
  useGetGrossPotentialRevenueQuery,
  useGetOccupancyQuery,
  useGetRevPAFQuery,
} from '@/api/reportingApi';
import { getChangeType, formatChange, getFormattedDate } from '../ExecutiveSummaryTab/utils';

const MetricCards = ({ apiParams, range }) => {
  const {
    data: grossRentalRevenue,
    isLoading: loadingGRR,
    isFetching: fetchingGRR,
  } = useGetGrossRentalRevenueQuery(apiParams);
  const {
    data: grossPotentialRevenue,
    isLoading: loadingGPR,
    isFetching: fetchingGPR,
  } = useGetGrossPotentialRevenueQuery(apiParams);
  const {
    data: occupancy,
    isLoading: loadingOccupancy,
    isFetching: fetchingOccupancy,
  } = useGetOccupancyQuery(apiParams);
  const {
    data: revPAF,
    isLoading: loadingRevPAF,
    isFetching: fetchingRevPAF,
  } = useGetRevPAFQuery(apiParams);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          title="Gross Rental Revenue"
          value={grossRentalRevenue?.formatted_revenue || '$0.00'}
          date={getFormattedDate(grossRentalRevenue, range?.[1])}
          change={formatChange(grossRentalRevenue)}
          changeType={getChangeType(grossRentalRevenue)}
          loading={loadingGRR || fetchingGRR}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          title="Gross Potential Revenue"
          value={grossPotentialRevenue?.formatted_revenue || '$0.00'}
          date={getFormattedDate(grossPotentialRevenue, range?.[1])}
          change={formatChange(grossPotentialRevenue)}
          changeType={getChangeType(grossPotentialRevenue)}
          loading={loadingGPR || fetchingGPR}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          title="Occupancy"
          value={
            occupancy?.formatted_occupancy ||
            (occupancy?.occupancy_percentage
              ? `${occupancy.occupancy_percentage.toFixed(2)}%`
              : '0.00%')
          }
          date={getFormattedDate(occupancy, range?.[1])}
          change={formatChange(occupancy)}
          changeType={getChangeType(occupancy)}
          loading={loadingOccupancy || fetchingOccupancy}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <MetricCard
          title="RevPAF"
          value={
            revPAF?.formatted_revpaf || (revPAF?.revpaf ? `${revPAF.revpaf.toFixed(2)}` : '$0.00')
          }
          date={getFormattedDate(revPAF, range?.[1])}
          change={formatChange(revPAF)}
          changeType={getChangeType(revPAF)}
          loading={loadingRevPAF || fetchingRevPAF}
        />
      </Col>
    </Row>
  );
};

export default MetricCards;
