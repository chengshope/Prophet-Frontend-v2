import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Input, Select, Segmented, Space, Card } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import PageFrame from '@/components/common/PageFrame';
import { CompetitorsTable, CompetitorMap } from '@/components/widgets/Competitors';
import { useGetCompetitorsQuery, useUpdateFacilityMutation } from '@/api/competitorsApi';
import { useGetFacilityByIdQuery } from '@/api/streetRatesApi';
import { setCachedFacilities } from '@/features/competitors/competitorsSlice';
import { selectFacilityOptions } from '@/features/competitors/competitorsSelector';
import { createValidatedStrategySetter } from '@/utils/strategyValidation';
import { useGetFacilitiesListQuery } from '@/api/facilitiesApi';
import './Competitors.less';

const { Search } = Input;

const Competitors = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [strategy, setStrategy] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [hoveredCompetitor, setHoveredCompetitor] = useState(null);
  const [previousFacilityId, setPreviousFacilityId] = useState(null);

  const { data: facilities, isLoading: facilitiesLoading } = useGetFacilitiesListQuery();

  const { data: selectedFacility, isLoading: isFacilityLoading } = useGetFacilityByIdQuery(id, {
    skip: !id,
  });

  const [updateFacility] = useUpdateFacilityMutation();

  const setValidatedStrategy = useMemo(() => createValidatedStrategySetter(setStrategy), []);

  const facilityCoords = useMemo(() => {
    if (!selectedFacility?.latitude || !selectedFacility?.longitude) return null;
    setValidatedStrategy(selectedFacility.street_rate_strategy);
    return {
      lat: parseFloat(selectedFacility.latitude),
      lng: parseFloat(selectedFacility.longitude),
    };
  }, [selectedFacility, setValidatedStrategy]);

  const competitorsApiParams = useMemo(() => {
    if (!selectedFacility?.stortrack_id) {
      return null;
    }
    return {
      storeTrackId: selectedFacility.stortrack_id,
      search: debouncedSearch || '',
    };
  }, [selectedFacility?.stortrack_id, debouncedSearch]);

  const {
    data: competitorsData,
    isLoading: competitorsLoading,
    isFetching: competitorsFetching,
    refetch,
  } = useGetCompetitorsQuery(competitorsApiParams, { skip: !competitorsApiParams });

  const competitors = useMemo(() => {
    if (!selectedFacility?.stortrack_id) {
      return [];
    }
    return competitorsData || [];
  }, [selectedFacility?.stortrack_id, competitorsData]);

  const isLoadingCompetitors = useMemo(() => {
    if (isFacilityLoading) return true;
    if (competitorsFetching) return true;
    if (selectedFacility?.stortrack_id && competitorsLoading) return true;
    if (selectedFacility?.stortrack_id && search !== debouncedSearch) return true;

    return false;
  }, [
    isFacilityLoading,
    selectedFacility?.stortrack_id,
    competitorsLoading,
    search,
    debouncedSearch,
    competitorsFetching,
  ]);

  const facilityOptions = useSelector(selectFacilityOptions);

  const strategyOptions = useMemo(
    () => [
      { label: 'Mirror Competitors', value: 'mirror' },
      { label: 'Maverick', value: 'maverick' },
      { label: 'Happy Medium', value: 'happy_medium' },
      { label: 'Maverick+', value: 'maverick_plus' },
    ],
    []
  );

  useEffect(() => {
    if (facilityCoords) {
      setMapCenter(facilityCoords);
    } else {
      setMapCenter({ lat: 37.7749, lng: -122.4194 });
    }
  }, [facilityCoords]);

  useEffect(() => {
    if (facilities) {
      dispatch(setCachedFacilities(facilities));
    }
  }, [facilities, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (id !== previousFacilityId) {
      setSearch('');
      setDebouncedSearch('');
      // Clear hovered competitor
      setHoveredCompetitor(null);
      // Update previous facility ID
      setPreviousFacilityId(id);
    }
  }, [id, previousFacilityId]);

  useEffect(() => {
    if (selectedFacility && !selectedFacility.stortrack_id) {
      setSearch('');
      setDebouncedSearch('');
      setHoveredCompetitor(null);
    }
  }, [selectedFacility?.stortrack_id]);

  const handleFacilityChange = useCallback(
    (facilityId, { facility }) => {
      setSearch('');
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

      try {
        await updateFacility({
          facilityId: selectedFacility.facility_id,
          street_rate_strategy: value,
        }).unwrap();
      } catch (error) {
        console.error('Error updating strategy:', error);
        // Revert strategy on error
        setValidatedStrategy(selectedFacility?.street_rate_strategy);
      }
    },
    [selectedFacility, setValidatedStrategy, updateFacility]
  );

  const hoverTimeoutRef = useRef(null);

  const handleRowHover = useCallback((competitor) => {
    setHoveredCompetitor(competitor);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (competitor && competitor.latitude && competitor.longitude) {
      hoverTimeoutRef.current = setTimeout(() => {
        setMapCenter({
          lat: parseFloat(competitor.latitude),
          lng: parseFloat(competitor.longitude),
        });
      }, 50);
    }
  }, []);

  const handleTableLeave = useCallback(() => {
    setHoveredCompetitor(null);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (facilityCoords) {
      setMapCenter(facilityCoords);
    }
  }, [facilityCoords]);

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
          filterOption={(input, option) => {
            const searchTerm = input.toLowerCase();
            return (
              option.label.toLowerCase().includes(searchTerm) ||
              (option.searchText && option.searchText.includes(searchTerm))
            );
          }}
          popupMatchSelectWidth={false}
          listHeight={400}
          optionFilterProp="label"
          notFoundContent={facilitiesLoading ? 'Loading...' : 'No facilities found'}
          autoFocus={false}
        />,
      ]}
    >
      <Space direction="vertical" size="large" className="page">
        <Row gutter={[16, 8]} align="middle" justify="space-between">
          <Col xs={24} md={8}>
            <Search
              size="middle"
              placeholder={
                selectedFacility?.stortrack_id
                  ? 'Search competitors...'
                  : 'Select a facility to search competitors'
              }
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              allowClear
              loading={isLoadingCompetitors && selectedFacility?.stortrack_id}
            />
          </Col>
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Segmented
              size="middle"
              value={strategy}
              onChange={handleStrategyChange}
              options={strategyOptions}
              disabled={!selectedFacility}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <CompetitorsTable
              data={competitors}
              loading={isLoadingCompetitors}
              onCompetitorUpdate={refetch}
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
