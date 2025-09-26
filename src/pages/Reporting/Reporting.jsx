import PageFrame from '@/components/common/PageFrame';
import { Segmented, Space } from 'antd';
import { useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ExecutiveSummaryTab from '@/components/widgets/Reporting/ExecutiveSummary';
import StreetRatesTab from '@/components/widgets/Reporting/StreetRates';
import ExistingRatesTab from '@/components/widgets/Reporting/ExistingRates';
import { setActiveTab } from '@/features/reporting/reportingSlice';
import { selectActiveTab } from '@/features/reporting/reportingSelector';

const tabItems = [
  {
    key: 'executive-summary',
    label: 'Executive Summary',
    component: ExecutiveSummaryTab,
    path: '/reporting/executive-summary',
  },
  {
    key: 'street-rates',
    label: 'Street Rates',
    component: StreetRatesTab,
    path: '/reporting/street-rates',
  },
  {
    key: 'existing-rates',
    label: 'Existing Rates',
    component: ExistingRatesTab,
    path: '/reporting/existing-rates',
  },
];

const Reporting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get active tab from Redux store
  const activeTabFromStore = useSelector(selectActiveTab);

  const currentKey = useMemo(
    () => tabItems.find((t) => location.pathname.startsWith(t.path))?.key ?? 'executive-summary',
    [location.pathname]
  );

  useEffect(() => {
    dispatch(setActiveTab(currentKey));
  }, [currentKey, dispatch]);

  const CurrentComponent =
    tabItems.find((t) => t.key === currentKey)?.component ?? ExecutiveSummaryTab;

  const segmentedOptions = tabItems.map((item) => ({
    label: item.label,
    value: item.key,
  }));

  const handleTabChange = (key) => {
    const tab = tabItems.find((t) => t.key === key);
    if (tab) {
      dispatch(setActiveTab(key));
      navigate(tab.path);
    }
  };

  return (
    <PageFrame
      title="Reporting"
      extra={[
        <Segmented
          size="middle"
          value={activeTabFromStore}
          onChange={handleTabChange}
          options={segmentedOptions}
        />,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <CurrentComponent />
      </Space>
    </PageFrame>
  );
};

export default Reporting;
