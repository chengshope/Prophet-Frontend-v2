import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Input, Button, Select, Card, Typography, Space, message, Segmented } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
import {
  useGetCompetitorsQuery,
  useGetFacilitiesQuery,
  useUpdateFacilityMutation,
} from '@/api/competitorsApi';
import CompetitorsTable from './CompetitorsTable/CompetitorsTable';
import CompetitorMap from './CompetitorMap/CompetitorMap';
import { STRATEGY_OPTIONS } from '../../../utils/config';
import { createValidatedStrategySetter, getStrategyLabel } from '../../../utils/strategyValidation';

const { Title, Text } = Typography;
const { Option } = Select;

const Competitors = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState(id || null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [facilityCoords, setFacilityCoords] = useState(null);
  const [hoveredCompetitor, setHoveredCompetitor] = useState(null);
  const [previousFacilityId, setPreviousFacilityId] = useState(null);

  // API hooks
  const { data: facilitiesData } = useGetFacilitiesQuery();
  const {
    data: competitorsData,
    isLoading: isLoadingCompetitors,
    refetch,
  } = useGetCompetitorsQuery(
    { storeTrackId: selectedFacility?.stortrack_id, search: debouncedSearch },
    { skip: !selectedFacility?.stortrack_id }
  );

  // Strategy-related API hooks
  const [updateFacility] = useUpdateFacilityMutation();

  // Get selected facility details
  const selectedFacility = useMemo(() => {
    if (!facilitiesData?.data || !selectedFacilityId) return null;
    return facilitiesData.data.find((f) => f.facility_id === parseInt(selectedFacilityId));
  }, [facilitiesData, selectedFacilityId]);

  // Helper function to validate and set strategy using utility
  const setValidatedStrategy = useMemo(
    () => createValidatedStrategySetter(setSelectedStrategy),
    []
  );

  // Set initial strategy when facility is selected
  useEffect(() => {
    if (selectedFacility) {
      // Use facility's street_rate_strategy property directly with validation
      setValidatedStrategy(selectedFacility.street_rate_strategy);

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
  }, [selectedFacility, setValidatedStrategy]);

  // Handle facility selection
  const handleFacilityChange = (facilityId) => {
    setSelectedFacilityId(facilityId);
    navigate(`/competitors/${facilityId}`);
  };

  // Handle strategy change - immediately update facility (matching v1)
  const handleStrategyChange = async (strategy) => {
    if (!selectedFacilityId || !strategy) return;

    setSelectedStrategy(strategy);

    // Immediately save to backend like v1 does
    try {
      await updateFacility({
        facilityId: selectedFacilityId,
        street_rate_strategy: strategy,
      }).unwrap();

      message.success('Strategy updated successfully');
    } catch (error) {
      console.error('Error updating strategy:', error);
      message.error('Failed to update strategy');
      // Revert strategy on error
      setValidatedStrategy(selectedFacility?.street_rate_strategy);
    }
  };

  // Debounce search input (matching v1's 500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset competitors data when facility changes
  useEffect(() => {
    if (selectedFacilityId !== previousFacilityId) {
      // Clear search when facility changes
      setSearch('');
      setDebouncedSearch('');
      // Clear hovered competitor
      setHoveredCompetitor(null);
      // Update previous facility ID
      setPreviousFacilityId(selectedFacilityId);
    }
  }, [selectedFacilityId, previousFacilityId]);

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
            <div style={{ marginTop: '8px' }}>
              <Segmented
                options={strategyOptions}
                value={selectedStrategy}
                onChange={handleStrategyChange}
                disabled={!selectedFacility}
                style={{ width: '100%' }}
              />
            </div>
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
                  <strong>Current Strategy:</strong>{' '}
                  {getStrategyLabel(selectedFacility.street_rate_strategy)}
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

      {selectedFacility && (
        <>
          {/* Search and Controls */}
          <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="small">
                <Input
                  placeholder="Search competitors..."
                  prefix={<SearchOutlined />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ maxWidth: '400px' }}
                  suffix={
                    isLoadingCompetitors && debouncedSearch !== search ? (
                      <SearchOutlined spin />
                    ) : null
                  }
                />
                {debouncedSearch && competitorsData && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Found {competitorsData.length} competitor
                    {competitorsData.length !== 1 ? 's' : ''}
                    {debouncedSearch && ` for "${debouncedSearch}"`}
                  </Text>
                )}
              </Space>
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
            loading={isLoadingCompetitors || (search !== debouncedSearch && search.length > 0)}
            selectedFacility={selectedFacility}
            onCompetitorUpdate={refetch}
            onRowHover={setHoveredCompetitor}
            onTableLeave={() => setHoveredCompetitor(null)}
          />

          {/* Map */}
          <Card id="competitor-map" title="Competitor Locations" style={{ marginTop: '24px' }}>
            <CompetitorMap
              competitors={competitorsData || []}
              selectedFacility={selectedFacility}
              facilityCoords={facilityCoords}
              mapCenter={mapCenter}
              hoveredCompetitor={hoveredCompetitor}
            />
          </Card>
        </>
      )}

      {!selectedFacility && (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <EnvironmentOutlined style={{ fontSize: '48px', opacity: 0.45 }} />
            <Title level={3} style={{ opacity: 0.45, marginTop: '16px' }}>
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
