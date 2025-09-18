import PageFrame from '@/components/common/PageFrame';
import StreetRatesManagement from '@/components/widgets/StreetRatesManagement';
import './StreetRates.less';

const StreetRates = () => {
  return (
    <PageFrame title="Street Rates">
      <StreetRatesManagement />
    </PageFrame>
  );
};

export default StreetRates;
