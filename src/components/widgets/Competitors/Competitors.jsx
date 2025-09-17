import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Input, Button, Select, Card, Typography, Space, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, SaveOutlined } from '@ant-design/icons';
import {
  useGetCompetitorsQuery,
  useGetFacilitiesQuery,
  useUpdateFacilityMutation,
} from '@/api/competitorsApi';
import CompetitorsTable from './CompetitorsTable/CompetitorsTable';
import CompetitorMap from './CompetitorMap/CompetitorMap';
import { STRATEGY_OPTIONS } from '../../../utils/LegacyV1/config';

const { Title, Text } = Typography;
const { Option } = Select;

const Competitors = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState(id || null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [facilityCoords, setFacilityCoords] = useState(null);

  // API hooks
  const { data: facilitiesData } = useGetFacilitiesQuery();
  const {
    data: competitorsData,
    isLoading: isLoadingCompetitors,
    refetch,
  } = useGetCompetitorsQuery(
    { facilityId: selectedFacilityId, search },
    { skip: !selectedFacilityId }
  );
  const [updateFacility] = useUpdateFacilityMutation();

  // Get selected facility details
  const selectedFacility = useMemo(() => {
    if (!facilitiesData?.data || !selectedFacilityId) return null;
    return facilitiesData.data.find((f) => f.facility_id === parseInt(selectedFacilityId));
  }, [facilitiesData, selectedFacilityId]);

  // Set initial strategy when facility is selected
  useEffect(() => {
    if (selectedFacility) {
      setSelectedStrategy(selectedFacility.strategy || null);

      // Set facility coordinates and map center
      if (selectedFacility.latitude && selectedFacility.longitude) {
        const coords = {
          lat: parseFloat(selectedFacility.latitude),
          lng: parseFloat(selectedFacility.longitude),
        };
        setFacilityCoords(coords);
        setMapCenter(coords);
      }
    }
  }, [selectedFacility]);

  // Handle facility selection
  const handleFacilityChange = (facilityId) => {
    setSelectedFacilityId(facilityId);
    navigate(`/competitors/${facilityId}`);
  };

  // Handle strategy change
  const handleStrategyChange = (strategy) => {
    setSelectedStrategy(strategy);
  };

  // Save strategy
  const handleSaveStrategy = async () => {
    if (!selectedFacilityId || !selectedStrategy) {
      message.warning('Please select a facility and strategy');
      return;
    }

    try {
      await updateFacility({
        facilityId: selectedFacilityId,
        strategy: selectedStrategy,
      }).unwrap();

      message.success('Strategy updated successfully');
    } catch (error) {
      console.error('Error updating strategy:', error);
      message.error('Failed to update strategy');
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedFacilityId) {
        refetch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, refetch, selectedFacilityId]);

  // Prepare facility options
  const facilityOptions = useMemo(() => {
    if (!facilitiesData?.data) return [];
    return facilitiesData.data.map((facility) => ({
      value: facility.facility_id,
      label: `${facility.facility_name} - ${facility.city}, ${facility.state}`,
    }));
  }, [facilitiesData]);

  // Prepare strategy options
  const strategyOptions = STRATEGY_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Competitors
          </Title>
        </Col>
      </Row>

      {/* Facility Selection */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} md={8}>
            <Text strong>Select Facility:</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              placeholder="Choose a facility"
              value={selectedFacilityId}
              onChange={handleFacilityChange}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {facilityOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} md={8}>
            <Text strong>Strategy:</Text>
            <Select
              style={{ width: '100%', marginTop: '8px' }}
              placeholder="Select strategy"
              value={selectedStrategy}
              onChange={handleStrategyChange}
              disabled={!selectedFacilityId}
            >
              {strategyOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} md={8} style={{ paddingTop: '24px' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveStrategy}
              disabled={
                !selectedFacilityId ||
                !selectedStrategy ||
                selectedStrategy === selectedFacility?.strategy
              }
            >
              Save Strategy
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Facility Information */}
      {selectedFacility && (
        <Card style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Title level={4}>{selectedFacility.facility_name}</Title>
              <Space direction="vertical" size="small">
                <Text>
                  <strong>Address:</strong> {selectedFacility.address}
                </Text>
                <Text>
                  <strong>City:</strong> {selectedFacility.city}, {selectedFacility.state}{' '}
                  {selectedFacility.zip}
                </Text>
                <Text>
                  <strong>Phone:</strong> {selectedFacility.phone || 'N/A'}
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Text>
                  <strong>Current Strategy:</strong> {selectedFacility.strategy || 'Not set'}
                </Text>
                <Text>
                  <strong>Total Units:</strong> {selectedFacility.total_units || 'N/A'}
                </Text>
                <Text>
                  <strong>Occupied Units:</strong> {selectedFacility.occupied_units || 'N/A'}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {selectedFacilityId && (
        <>
          {/* Search and Controls */}
          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Input
                placeholder="Search competitors..."
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ maxWidth: '400px' }}
              />
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Button
                icon={<EnvironmentOutlined />}
                onClick={() => {
                  // Scroll to map or focus map
                  document.getElementById('competitor-map')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View on Map
              </Button>
            </Col>
          </Row>

          {/* Competitors Table */}
          <CompetitorsTable
            data={competitorsData}
            loading={isLoadingCompetitors}
            selectedFacility={selectedFacility}
            onCompetitorUpdate={refetch}
          />

          {/* Map */}
          <Card id="competitor-map" title="Competitor Locations" style={{ marginTop: '24px' }}>
            <CompetitorMap
              competitors={competitorsData || []}
              selectedFacility={selectedFacility}
              facilityCoords={facilityCoords}
              mapCenter={mapCenter}
              onMapCenterChange={setMapCenter}
            />
          </Card>
        </>
      )}

      {!selectedFacilityId && (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <EnvironmentOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
            <Title level={3} style={{ color: '#d9d9d9', marginTop: '16px' }}>
              Select a Facility
            </Title>
            <Text type="secondary">
              Choose a facility from the dropdown above to view and manage competitors
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Competitors;
