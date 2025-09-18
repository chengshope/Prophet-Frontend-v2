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
import './Competitors.less';

const { Search } = Input;

const competitorTypeOptions = [
  { label: 'Direct', value: 'Direct' },
  { label: 'Indirect', value: 'Indirect' },
  { label: 'Non-competitor', value: 'Non-competitor' },
];

const Competitors = () => {
  const navigate = useNavigate();
  const { id: facilityId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // API queries
  const { data: facilities, isLoading: facilitiesLoading } = useGetFacilitiesQuery();
  const { data: competitors, isLoading: competitorsLoading } = useGetCompetitorsQuery(
    { facility_id: facilityId },
    { skip: !facilityId }
  );
  const [updateFacility] = useUpdateFacilityMutation();

  // Get current facility
  const currentFacility = useMemo(() => {
    if (!facilities || !facilityId) return null;
    return facilities.find((f) => f.facility_id === parseInt(facilityId));
  }, [facilities, facilityId]);

  // Filter competitors based on search and filters
  const filteredCompetitors = useMemo(() => {
    if (!competitors) return [];

    return competitors.filter((competitor) => {
      const matchesSearch = competitor.facility_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStrategy =
        selectedStrategy === 'all' || competitor.strategy === selectedStrategy;
      const matchesType = selectedType === 'all' || competitor.type === selectedType;

      return matchesSearch && matchesStrategy && matchesType;
    });
  }, [competitors, searchTerm, selectedStrategy, selectedType]);

  // Handle strategy update
  const handleStrategyUpdate = async (competitorId, newStrategy) => {
    try {
      await updateFacility({
        facility_id: competitorId,
        strategy: newStrategy,
      }).unwrap();
      message.success('Strategy updated successfully');
    } catch (error) {
      message.error('Failed to update strategy');
    }
  };

  // Handle type update
  const handleTypeUpdate = async (competitorId, newType) => {
    try {
      await updateFacility({
        facility_id: competitorId,
        type: newType,
      }).unwrap();
      message.success('Type updated successfully');
    } catch (error) {
      message.error('Failed to update type');
    }
  };

  const columns = [
    {
      title: 'Facility Name',
      dataIndex: 'facility_name',
      key: 'facility_name',
      render: (text, record) => (
        <Space>
          <ShopOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <Space>
          <EnvironmentOutlined />
          <span>{`${record.address}, ${record.city}, ${record.state} ${record.zip}`}</span>
        </Space>
      ),
    },
    {
      title: 'Distance (mi)',
      dataIndex: 'distance_miles',
      key: 'distance_miles',
      render: (distance) => distance?.toFixed(2) || 'N/A',
      sorter: (a, b) => (a.distance_miles || 0) - (b.distance_miles || 0),
    },
    {
      title: 'Strategy',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (strategy, record) => (
        <Select
          value={strategy || 'none'}
          style={{ width: 120 }}
          onChange={(value) => handleStrategyUpdate(record.facility_id, value)}
          options={STRATEGY_OPTIONS}
        />
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type, record) => (
        <Select
          value={type || 'Direct'}
          style={{ width: 140 }}
          onChange={(value) => handleTypeUpdate(record.facility_id, value)}
          options={competitorTypeOptions}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'enabled' ? 'green' : 'red'}>
          {status?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
    },
  ];

  if (!facilityId) {
    return (
      <PageFrame title="Competitors" extra={[]}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h3>Select a facility to view competitors</h3>
            <p>Choose a facility from the navigation to see its competitor analysis.</p>
          </div>
        </Card>
      </PageFrame>
    );
  }

  return (
    <PageFrame
      title={`Competitors - ${currentFacility?.facility_name || 'Loading...'}`}
      extra={[
        <Button
          key="back"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/competitors')}
        >
          Back to Facilities
        </Button>,
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Current Facility Info */}
        {currentFacility && (
          <Card title="Current Facility" size="small">
            <Row gutter={16}>
              <Col span={12}>
                <strong>Name:</strong> {currentFacility.facility_name}
              </Col>
              <Col span={12}>
                <strong>Address:</strong> {currentFacility.address}, {currentFacility.city},{' '}
                {currentFacility.state} {currentFacility.zip}
              </Col>
            </Row>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Search competitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Select
                placeholder="Strategy"
                value={selectedStrategy}
                onChange={setSelectedStrategy}
                style={{ width: '100%' }}
                options={[
                  { label: 'All Strategies', value: 'all' },
                  ...STRATEGY_OPTIONS,
                ]}
              />
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Select
                placeholder="Type"
                value={selectedType}
                onChange={setSelectedType}
                style={{ width: '100%' }}
                options={[
                  { label: 'All Types', value: 'all' },
                  ...competitorTypeOptions,
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space>
                <span>
                  <strong>Total Competitors:</strong> {filteredCompetitors.length}
                </span>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Competitors Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredCompetitors}
            rowKey="facility_id"
            loading={competitorsLoading || facilitiesLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} competitors`,
            }}
            scroll={{ x: 800 }}
          />
        </Card>
      </Space>
    </PageFrame>
  );
};

export default Competitors;
