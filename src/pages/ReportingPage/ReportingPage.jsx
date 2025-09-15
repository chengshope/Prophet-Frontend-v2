import PageFrame from '@/components/common/PageFrame';
import { Segmented, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExecutiveSummaryTab from '@/components/widgets/ExecutiveSummary';
import ExistingRatesTab from './components/ExistingRatesTab';
import StreetRatesTab from './components/StreetRatesTab';

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

const ReportingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('executive-summary');

  const handleTabChange = (key) => {
    const tab = tabItems.find((t) => t.key === key);
    if (tab) {
      setActiveTab(key);
      navigate(tab.path);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const currentKey =
      tabItems.find((t) => currentPath.startsWith(t.path))?.key || 'executive-summary';
    setActiveTab(currentKey);
  }, [location.pathname]);

  const currentTab = tabItems.find((t) => t.key === activeTab);
  const CurrentComponent = currentTab?.component || ExecutiveSummaryTab;

  const segmentedOptions = tabItems.map((item) => ({
    label: item.label,
    value: item.key,
  }));

  return (
    <PageFrame
      title="Reporting"
      extra={[
        <Segmented
          size="middle"
          value={activeTab}
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

export default ReportingPage;
