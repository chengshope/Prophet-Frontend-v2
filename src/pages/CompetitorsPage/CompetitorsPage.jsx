import PageFrame from '@/components/common/PageFrame';
import { ArrowLeftOutlined, EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Segmented, Select, Space, Table, Tag, message } from 'antd';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetCompetitorsQuery,
  useGetFacilitiesQuery,
  useUpdateFacilityMutation,
} from '@/api/competitorsApi';
import { STRATEGY_OPTIONS } from '../../utils/config';
import './CompetitorsPage.less';

const { Search } = Input;

const competitorTypeOptions = [
  { label: 'Direct', value: 'Direct' },
  { label: 'Indirect', value: 'Indirect' },
  { label: 'Non-competitor', value: 'Non-competitor' },
];

const CompetitorsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedFacility, setSelectedFacility] = useState(id || undefined);
  const [strategy, setStrategy] = useState();
  const [search, setSearch] = useState('');

  // API hooks
  const { data: facilitiesData } = useGetFacilitiesQuery();
  const { data: competitorsData, isLoading } = useGetCompetitorsQuery(
    { facilityId: selectedFacility, search },
    { skip: !selectedFacility }
  );
  const [updateFacility] = useUpdateFacilityMutation();

  // Get selected facility details
  const selectedFacilityData = useMemo(() => {
    if (!facilitiesData?.data || !selectedFacility) return null;
    return facilitiesData.data.find((f) => f.facility_id === parseInt(selectedFacility));
  }, [facilitiesData, selectedFacility]);

  // Set initial strategy when facility is selected
  useEffect(() => {
    if (selectedFacilityData) {
      setStrategy(selectedFacilityData.strategy || null);
    }
  }, [selectedFacilityData]);

  const facilityOptions = useMemo(() => {
    if (!facilitiesData?.data) return [];
    return facilitiesData.data.map((facility) => ({
      label: `${facility.facility_name} - ${facility.city}, ${facility.state}`,
      value: facility.facility_id,
    }));
  }, [facilitiesData]);

  const strategyLabels = useMemo(() => STRATEGY_OPTIONS.map((s) => s.label), []);

  // Handle strategy change and save
  const handleStrategyChange = async (newStrategy) => {
    setStrategy(newStrategy);
    if (selectedFacility) {
      try {
        const strategyValue = STRATEGY_OPTIONS.find((opt) => opt.label === newStrategy)?.value;
        await updateFacility({
          facilityId: selectedFacility,
          strategy: strategyValue,
        }).unwrap();
        message.success('Strategy updated successfully');
      } catch (error) {
        console.error('Error updating strategy:', error);
        message.error('Failed to update strategy');
      }
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'comp_type',
      key: 'warning',
      width: 40,
      render: (val) => (!val ? <Tag color="red">!</Tag> : null),
    },
    {
      title: 'Competitor',
      dataIndex: 'store_name',
      key: 'store_name',
      sorter: (a, b) => (a.store_name || '').localeCompare(b.store_name || ''),
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.store_name}</div>
          {record.address && (
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.address}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      sorter: (a, b) => (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0),
      render: (value) => (value ? `${parseFloat(value).toFixed(1)} mi` : 'N/A'),
    },
    {
      title: 'Type',
      dataIndex: 'comp_type',
      key: 'comp_type',
      render: (value, record) => (
        <Select
          size="small"
          value={value}
          placeholder="Select..."
          style={{ width: 160 }}
          options={competitorTypeOptions}
          onChange={(val) => {
            // Handle competitor type change
            console.log('Competitor type changed:', record.id, val);
          }}
        />
      ),
    },
  ];

  return (
    <PageFrame
      title="Competitors"
      extra={[
        <Space key="controls">
          <Select
            showSearch
            allowClear
            size="middle"
            placeholder="Select Facility"
            options={facilityOptions}
            value={selectedFacility}
            onChange={(val) => {
              setSelectedFacility(val);
              if (val) {
                navigate(`/competitors/${val}`);
              } else {
                navigate('/competitors');
              }
            }}
          />
          <Segmented
            size="middle"
            value={strategy}
            onChange={handleStrategyChange}
            options={strategyLabels}
            disabled={!selectedFacility}
          />
        </Space>,
      ]}
    >
      <Space direction="vertical" size="large" className="page">
        <Row gutter={[16, 8]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Search
              size="middle"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12} className="actions-col">
            <Button
              color="green"
              variant="solid"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/street-rates')}
            >
              Back to Street Rates
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Table
              rowKey="id"
              bordered
              size="small"
              columns={columns}
              dataSource={competitorsData || []}
              loading={isLoading}
              locale={{
                emptyText: (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '40px 20px',
                      color: '#8c8c8c',
                    }}
                  >
                    <ShopOutlined
                      style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
                    />
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        color: '#595959',
                      }}
                    >
                      No Competitors Found
                    </div>
                    <div style={{ fontSize: '14px', textAlign: 'center', lineHeight: '1.5' }}>
                      {selectedFacility
                        ? 'Competitor information will appear here when available.'
                        : 'Please select a facility to view competitors.'}
                      <br />
                      Try adjusting your search criteria or check back later.
                    </div>
                  </div>
                ),
              }}
              pagination={{ pageSize: 10 }}
            />
          </Col>
          <Col xs={24} lg={12}>
            <Card className="page-card">
              <div
                style={{
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fafafa',
                  border: '2px dashed #d9d9d9',
                  borderRadius: '8px',
                  color: '#8c8c8c',
                }}
              >
                <EnvironmentOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div style={{ fontSize: '16px', fontWeight: 500 }}>Interactive Map</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Competitor locations will appear here
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Space>
    </PageFrame>
  );
};

export default CompetitorsPage;
