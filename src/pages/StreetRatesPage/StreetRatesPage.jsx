import PageFrame from '@/components/common/PageFrame';
import StreetRatesManagement from '@/components/widgets/StreetRatesManagement';
import './StreetRatesPage.less';

const StreetRatesPage = () => {
  return (
    <PageFrame title="Street Rates">
      <StreetRatesManagement />
    </PageFrame>
  );
};

export default StreetRatesPage;
