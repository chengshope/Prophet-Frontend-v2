import { useGetPortfoliosListQuery } from '@/api/portfolioApi';
import {
  useGetPortfolioDetailsByIdQuery,
  useSyncPortfolioFacilitiesMutation,
} from '@/api/settingsApi';
import PageFrame from '@/components/common/PageFrame';
import { FacilitiesTable, PortfolioSettings, UsersTable } from '@/components/widgets/Portfolio';
import CreatePortfolio from '@/components/widgets/Portfolio/Modal/CreatePortfolio';
import { selectPortfolioId, selectUser } from '@/features/auth/authSelector';
import { showError, showSuccess } from '@/utils/messageService';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './Portfolio.less';

const { Option } = Select;

const Portfolio = () => {
  const { id: portfolioId } = useParams();
  const navigate = useNavigate();

  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [createPortfolioVisible, setCreatePortfolioVisible] = useState(false);

  const user = useSelector(selectUser);
  const currentPortfolioId = useSelector(selectPortfolioId);
  const isIntegrator = user?.role?.name === 'integrator';

  const { data: portfolioSettings, refetch: refetchPortfolio } = useGetPortfolioDetailsByIdQuery(
    portfolioId || currentPortfolioId,
    {
      skip: !portfolioId && !currentPortfolioId,
    }
  );

  const {
    data: portfoliosList,
    isLoading: portfolioListLoading,
    isFetching: portfolioListFetching,
  } = useGetPortfoliosListQuery();

  const [syncPortfolioFacilities] = useSyncPortfolioFacilitiesMutation();

  useEffect(() => {
    if (portfolioSettings) {
      setSelectedPortfolio(portfolioSettings);
    }
  }, [portfolioSettings]);

  const handleSyncFacilities = async () => {
    if (!selectedPortfolio) {
      showError('Please select a portfolio');
      return;
    }

    setLoadingSync(true);
    try {
      await syncPortfolioFacilities(selectedPortfolio.id).unwrap();
      showSuccess('Facilities synced successfully!');
      refetchPortfolio();
    } catch (error) {
      console.error('Sync error:', error);
      showError('Failed to sync facilities');
    } finally {
      setLoadingSync(false);
    }
  };

  return (
    <PageFrame
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Portfolio</span>
          <Select
            style={{ width: 300 }}
            value={portfolioId ? parseInt(portfolioId) : undefined}
            onChange={(value) => navigate(`/portfolio/${value}`)}
            placeholder="Select Portfolio"
            loading={portfolioListLoading || portfolioListFetching}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {portfoliosList?.map((portfolio) => (
              <Option key={portfolio.id} value={portfolio.id}>
                {portfolio.portfolio_name}
              </Option>
            ))}
          </Select>
        </div>
      }
      extra={[
        <Button
          key="sync"
          icon={<SyncOutlined />}
          loading={loadingSync}
          variant="filled"
          color="danger"
          onClick={handleSyncFacilities}
        >
          Sync Facilities
        </Button>,
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          onClick={() => setCreatePortfolioVisible(true)}
        >
          Create Portfolio
        </Button>,
      ]}
    >
      {/* Portfolio Settings */}
      <PortfolioSettings portfolioId={portfolioId} />

      {/* Users Management - Only for Integrators */}
      {isIntegrator && selectedPortfolio && <UsersTable portfolioId={portfolioId} />}

      {/* StorTrack Integration */}
      {selectedPortfolio && (
        <FacilitiesTable portfolioId={portfolioId} onRefetch={refetchPortfolio} />
      )}

      {/* Create Portfolio Modal */}
      <CreatePortfolio
        visible={createPortfolioVisible}
        onCancel={() => setCreatePortfolioVisible(false)}
        onSuccess={(newPortfolio) => {
          // Navigate to the newly created portfolio
          if (newPortfolio?.id) {
            navigate(`/portfolio/${newPortfolio.id}`);
          }
        }}
      />
    </PageFrame>
  );
};

export default Portfolio;
