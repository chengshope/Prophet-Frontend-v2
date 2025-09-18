import PageFrame from '@/components/common/PageFrame';
import { Segmented, Space } from 'antd';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExecutiveSummaryTab from '@/components/widgets/ExecutiveSummary';
import StreetRatesTab from '@/components/widgets/StreetRates';
import ExistingRatesTab from '@/components/widgets/ExistingRates';

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

  const currentKey = useMemo(
    () => tabItems.find((t) => location.pathname.startsWith(t.path))?.key ?? 'executive-summary',
    [location.pathname]
  );

  const CurrentComponent =
    tabItems.find((t) => t.key === currentKey)?.component ?? ExecutiveSummaryTab;

  const segmentedOptions = tabItems.map((item) => ({
    label: item.label,
    value: item.key,
  }));

  const handleTabChange = (key) => {
    const tab = tabItems.find((t) => t.key === key);
    if (tab) navigate(tab.path);
  };

  return (
    <PageFrame
      title="Reporting"
      extra={[
        <Segmented
          size="middle"
          value={currentKey}
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
