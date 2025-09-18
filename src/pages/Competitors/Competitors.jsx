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
import CompetitorMap from '@/components/widgets/Competitors/CompetitorMap';
import './Competitors.less';

const { Search } = Input;

const competitorTypeOptions = [
  { label: 'Direct', value: 'Direct' },
  { label: 'Indirect', value: 'Indirect' },
  { label: 'Non-competitor', value: 'Non-competitor' },
];

const Competitors = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedFacility, setSelectedFacility] = useState(id || undefined);
  const [strategy, setStrategy] = useState();
  const [search, setSearch] = useState('');
  const [hoveredCompetitor, setHoveredCompetitor] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US

  // API queries
  const { data: facilities, isLoading: facilitiesLoading } = useGetFacilitiesQuery();
  const { data: competitors, isLoading: competitorsLoading } = useGetCompetitorsQuery(
    { facility_id: selectedFacility },
    { skip: !selectedFacility }
  );
  const [updateFacility] = useUpdateFacilityMutation();

  // Get facility options for dropdown
  const facilityOptions = useMemo(() => {
    if (!facilities) return [];
    return facilities.map((f) => ({
      label: f.facility_name,
      value: f.facility_id.toString(),
    }));
  }, [facilities]);

  // Get current facility
  const currentFacility = useMemo(() => {
    if (!facilities || !selectedFacility) return null;
    return facilities.find((f) => f.facility_id === parseInt(selectedFacility));
  }, [facilities, selectedFacility]);

  // Get facility coordinates for map center
  const facilityCoords = useMemo(() => {
    if (!currentFacility?.latitude || !currentFacility?.longitude) return null;
    return {
      lat: parseFloat(currentFacility.latitude),
      lng: parseFloat(currentFacility.longitude),
    };
  }, [currentFacility]);

  // Update map center when facility changes
  useEffect(() => {
    if (facilityCoords) {
      setMapCenter(facilityCoords);
    }
  }, [facilityCoords]);

  // Strategy labels for segmented control
  const strategyLabels = useMemo(() => STRATEGY_OPTIONS.map((s) => s.label), []);

  // Filter competitors based on search
  const filteredCompetitors = useMemo(() => {
    if (!competitors) return [];
    return competitors.filter(
      (competitor) =>
        competitor.store_name?.toLowerCase().includes(search.toLowerCase()) ||
        competitor.address?.toLowerCase().includes(search.toLowerCase())
    );
  }, [competitors, search]);

  // Handle competitor type update
  const handleCompetitorTypeUpdate = async (competitorId, newType) => {
    try {
      await updateFacility({
        facility_id: competitorId,
        comp_type: newType,
      }).unwrap();
      message.success('Competitor type updated successfully');
    } catch {
      // automatically handled by RTK Query
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
        <a href={record.source_url} target="_blank" rel="noreferrer">
          {record.store_name} {record.address}
        </a>
      ),
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      key: 'distance',
      sorter: (a, b) => (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0),
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
          onChange={(val) => handleCompetitorTypeUpdate(record.id, val)}
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
            onChange={(val) => setSelectedFacility(val)}
          />
          <Segmented
            size="middle"
            value={strategy}
            onChange={setStrategy}
            options={strategyLabels}
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
              dataSource={filteredCompetitors}
              loading={competitorsLoading || facilitiesLoading}
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
                      Competitor information will appear here when available.
                      <br />
                      Try adjusting your search criteria or check back later.
                    </div>
                  </div>
                ),
              }}
              pagination={{ pageSize: 10 }}
              onRow={(record) => ({
                onMouseEnter: () => setHoveredCompetitor(record),
                onMouseLeave: () => setHoveredCompetitor(null),
              })}
            />
          </Col>
          <Col xs={24} lg={12}>
            <Card className="page-card">
              {selectedFacility && facilityCoords ? (
                <CompetitorMap
                  competitors={filteredCompetitors || []}
                  selectedFacility={currentFacility}
                  facilityCoords={facilityCoords}
                  mapCenter={mapCenter}
                  onMapCenterChange={setMapCenter}
                  hoveredCompetitor={hoveredCompetitor}
                />
              ) : (
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
                    {selectedFacility
                      ? 'Loading competitor locations...'
                      : 'Select a facility to view competitor locations'}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Space>
    </PageFrame>
  );
};

export default Competitors;
