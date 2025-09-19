/**
 * Competitors Page Component
 * Following Rule #4: Main code structure should be pages/{PageName}/{PageComponent}.jsx
 * Following Rule #2: All API calls must be made via Redux Toolkit (RTK)
 * Matching v1 UI layout and functionality exactly
 */

import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Input, Select, Segmented, Space, Card, Flex, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

import PageFrame from '@/components/common/PageFrame';
import CompetitorsTable from '@/components/widgets/Competitors/CompetitorsTable/CompetitorsTable';
import CompetitorMap from '@/components/widgets/Competitors/CompetitorMap';

// RTK API imports (Rule #2: All API calls must be made via RTK)
import { useGetCompetitorsQuery, useUpdateFacilityMutation } from '@/api/competitorsApi';
import { useGetFacilityByIdQuery } from '@/api/streetRatesApi';

// Redux imports (only for caching API responses per Rule #29)
import { setCachedFacilities } from '@/features/competitors/competitorsSlice';
import { selectFacilityOptions } from '@/features/competitors/competitorsSelector';

// Validation imports
import { createValidatedStrategySetter } from '@/utils/strategyValidation';

import './Competitors.less';
import { useGetFacilitiesListQuery } from '@/api/facilitiesApi';

const { Search } = Input;
const { Text } = Typography;

const Competitors = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Local state (Rule #29: useState for local state)
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [strategy, setStrategy] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [hoveredCompetitor, setHoveredCompetitor] = useState(null);
  const [previousFacilityId, setPreviousFacilityId] = useState(null);

  // API queries (Rule #2: All API calls via RTK + Rule #29: redux for api responses)
  const { data: facilities, isLoading: facilitiesLoading } = useGetFacilitiesListQuery();

  // Get facility details when URL id changes (RTK)
  const { data: selectedFacility, isLoading: facilityLoading } = useGetFacilityByIdQuery(id, {
    skip: !id,
  });

  // RTK mutation for facility updates (including strategy)
  const [updateFacility] = useUpdateFacilityMutation();

  // Helper function to validate and set strategy using utility
  const setValidatedStrategy = useMemo(() => createValidatedStrategySetter(setStrategy), []);

  // Compute facility coordinates from selected facility
  const facilityCoords = useMemo(() => {
    if (!selectedFacility?.latitude || !selectedFacility?.longitude) return null;
    setValidatedStrategy(selectedFacility.street_rate_strategy);
    return {
      lat: parseFloat(selectedFacility.latitude),
      lng: parseFloat(selectedFacility.longitude),
    };
  }, [selectedFacility, setValidatedStrategy]);

  // Compute competitors API params
  const competitorsApiParams = useMemo(() => {
    if (!selectedFacility?.stortrack_id) return null;
    return {
      storeTrackId: selectedFacility.stortrack_id,
      search: debouncedSearch || '',
    };
  }, [selectedFacility?.stortrack_id, debouncedSearch]);

  // Get competitors data (RTK)
  const {
    data: competitors,
    isLoading: competitorsLoading,
    refetch,
  } = useGetCompetitorsQuery(competitorsApiParams, { skip: !competitorsApiParams });

  // Redux selectors (only for cached facilities dropdown)
  const facilityOptions = useSelector(selectFacilityOptions);

  // Strategy options (static)
  const strategyOptions = useMemo(
    () => [
      { label: 'Mirror Competitors', value: 'mirror' },
      { label: 'Maverick', value: 'maverick' },
      { label: 'Happy Medium', value: 'happy_medium' },
      { label: 'Maverick+', value: 'maverick_plus' },
    ],
    []
  );

  // Update map center when facility coordinates change
  useEffect(() => {
    if (facilityCoords) {
      setMapCenter(facilityCoords);
    } else {
      setMapCenter({ lat: 37.7749, lng: -122.4194 });
    }
  }, [facilityCoords]);

  // Cache facilities data when it's loaded (Rule #29: use redux for api responses)
  useEffect(() => {
    if (facilities) {
      dispatch(setCachedFacilities(facilities));
    }
  }, [facilities, dispatch]);

  // Debounce search input (matching v1's 500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset competitors data when facility changes
  useEffect(() => {
    if (id !== previousFacilityId) {
      // Clear search when facility changes
      setSearch('');
      setDebouncedSearch('');
      // Clear hovered competitor
      setHoveredCompetitor(null);
      // Update previous facility ID
      setPreviousFacilityId(id);
    }
  }, [id, previousFacilityId]);

  // Event handlers (copying v1 logic)
  const handleFacilityChange = useCallback(
    (facilityId, { facility }) => {
      setValidatedStrategy(facility.street_rate_strategy);
      navigate(`/competitors/${facilityId}`);
    },
    [navigate, setValidatedStrategy]
  );

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
  }, []);

  const handleStrategyChange = useCallback(
    async (value) => {
      if (!selectedFacility || !value) return;

      setStrategy(value);

      // Immediately update facility using RTK mutation (matching v1 behavior)
      try {
        await updateFacility({
          facilityId: selectedFacility.facility_id,
          street_rate_strategy: value,
        }).unwrap();

        console.log('Strategy updated successfully');
      } catch (error) {
        console.error('Error updating strategy:', error);
        // Revert strategy on error
        setValidatedStrategy(selectedFacility?.street_rate_strategy);
      }
    },
    [selectedFacility, setValidatedStrategy, updateFacility]
  );

  // Throttle ref for smooth map animations (matching v1 behavior)
  const hoverTimeoutRef = useRef(null);

  const handleRowHover = useCallback((competitor) => {
    setHoveredCompetitor(competitor);

    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Throttle map center changes for smoother animation (v1-like behavior)
    if (competitor && competitor.latitude && competitor.longitude) {
      hoverTimeoutRef.current = setTimeout(() => {
        setMapCenter({
          lat: parseFloat(competitor.latitude),
          lng: parseFloat(competitor.longitude),
        });
      }, 50); // Small delay for smoother transitions
    }
  }, []);

  const handleTableLeave = useCallback(() => {
    console.log('Left table area');
    setHoveredCompetitor(null);

    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Return to facility location when leaving table area
    if (facilityCoords) {
      setMapCenter(facilityCoords);
    }
  }, [facilityCoords]);

  const handleCompetitorUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <PageFrame
      title="Competitors"
      extra={[
        <Select
          showSearch
          allowClear
          size="middle"
          placeholder="Select Facility"
          options={facilityOptions}
          value={selectedFacility?.id}
          onChange={handleFacilityChange}
          loading={facilitiesLoading}
          style={{ width: 300 }}
          // Enhanced search functionality (matching v1 flexibility)
          filterOption={(input, option) => {
            const searchTerm = input.toLowerCase();
            // Search in label and additional search text
            return (
              option.label.toLowerCase().includes(searchTerm) ||
              (option.searchText && option.searchText.includes(searchTerm))
            );
          }}
          // Better dropdown behavior (matching v1 flexibility)
          popupMatchSelectWidth={false}
          listHeight={400}
          optionFilterProp="label"
          virtual={true} // Enable virtual scrolling for large lists
          // Show more results
          notFoundContent={facilitiesLoading ? 'Loading...' : 'No facilities found'}
          // Auto-focus search input when dropdown opens
          autoFocus={false}
        />,
      ]}
    >
      <Space direction="vertical" size="large" className="page">
        {/* Search Section */}
        <Flex justify="space-between" align="center">
          <Space direction="vertical" size="small">
            <Search
              size="middle"
              placeholder="Search competitors..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              allowClear
              style={{ width: 400 }}
              loading={competitorsLoading && debouncedSearch !== search}
            />
          </Space>
          <Segmented
            size="middle"
            value={strategy}
            onChange={handleStrategyChange}
            options={strategyOptions}
            disabled={!selectedFacility}
          />
        </Flex>

        {/* Main Content: Table and Map Side by Side (matching v1 layout) */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <CompetitorsTable
              data={competitors}
              loading={competitorsLoading || (search !== debouncedSearch && search.length > 0)}
              onCompetitorUpdate={handleCompetitorUpdate}
              onRowHover={handleRowHover}
              onTableLeave={handleTableLeave}
            />
          </Col>
          <Col xs={24} lg={12}>
            <Card className="page-card">
              {selectedFacility && facilityCoords ? (
                <CompetitorMap
                  competitors={competitors || []}
                  selectedFacility={selectedFacility}
                  facilityCoords={facilityCoords}
                  mapCenter={mapCenter}
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
                    backgroundColor: 'var(--ant-color-fill-quaternary)',
                    border: '2px dashed var(--ant-color-border)',
                    borderRadius: '8px',
                    opacity: 0.6,
                  }}
                >
                  <ShopOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
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
