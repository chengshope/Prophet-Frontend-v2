import PageFrame from '@/components/common/PageFrame';
import { ArrowLeftOutlined, EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Input, Row, Segmented, Select, Space, Table, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CompetitorsPage.less';

const { Search } = Input;

const STRATEGY_OPTIONS = [
  { label: 'Mirror Competitors', value: 'mirror' },
  { label: 'Maverick', value: 'maverick' },
  { label: 'Happy Medium', value: 'happy_medium' },
  { label: 'Maverick+', value: 'maverick_plus' },
];

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
  const [data, setData] = useState([]);

  const facilityOptions = useMemo(
    () => [
      { label: 'Facility A', value: '1' },
      { label: 'Facility B', value: '2' },
    ],
    []
  );

  const strategyLabels = useMemo(() => STRATEGY_OPTIONS.map((s) => s.label), []);

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
          onChange={(val) => {
            setData((prev) =>
              prev.map((row) => (row.id === record.id ? { ...row, comp_type: val } : row))
            );
          }}
        />
      ),
    },
  ];

  return (
    <PageFrame
      title="Competitors"
      extra={[
        <Space>
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
              dataSource={data}
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
