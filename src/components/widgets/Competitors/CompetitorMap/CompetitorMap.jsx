import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { Card, Typography, Space, Tag, Spin } from 'antd';
import { getDistance } from 'geolib';

const { Text } = Typography;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '450px',
  borderRadius: '6px',
  border: '1px solid #d9d9d9',
};
const defaultZoom = 14;

export default function CompetitorMap({
  competitors = [],
  selectedFacility,
  facilityCoords,
  mapCenter,
  hoveredCompetitor,
}) {
  const mapRef = useRef(null);
  const [prevLocation, setPrevLocation] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback(
    (map) => {
      mapRef.current = map;

      // 1. Show facility location on first load
      if (facilityCoords) {
        map.setCenter(facilityCoords);
        map.setZoom(defaultZoom);
      }
    },
    [facilityCoords]
  );

  // Handle facility coordinates change after map load
  useEffect(() => {
    if (mapRef.current && facilityCoords) {
      mapRef.current.setCenter(facilityCoords);
      mapRef.current.setZoom(defaultZoom);
    }
  }, [facilityCoords]);

  /**
   * Flexible pan/zoom animation:
   * - First render: set center directly.
   * - Subsequent updates: if distance > 5 km, zoom out then smooth pan and zoom back.
   * - Otherwise just pan.
   */
  useEffect(() => {
    if (!mapRef.current || !mapCenter) return;
    const map = mapRef.current;

    if (!prevLocation) {
      map.setCenter(mapCenter);
      setPrevLocation(mapCenter);
      return;
    }

    const dis = getDistance(
      { latitude: prevLocation.lat, longitude: prevLocation.lng },
      { latitude: mapCenter.lat, longitude: mapCenter.lng }
    );

    if (dis > 5000) {
      map.setZoom(10);
      setTimeout(() => map.panTo(mapCenter), 100);
      setTimeout(() => map.setZoom(defaultZoom), 200);
    } else {
      map.panTo(mapCenter);
    }

    setPrevLocation(mapCenter);
  }, [mapCenter]);

  // MarkerF icons - location pin design with circular hole like the attached image
  const facilityIcon = useMemo(
    () => ({
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
      fillColor: '#1890ff',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 1.5,
    }),
    []
  );

  const competitorIcon = useMemo(
    () => ({
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z',
      fillColor: '#f5222d',
      fillOpacity: 0.6,
      strokeWeight: 0,
      scale: 1.5,
    }),
    []
  );

  const hoveredCompetitorIcon = useMemo(
    () => ({
      ...competitorIcon,
      fillOpacity: 1,
      scale: 1.5,
      strokeWeight: 0,
    }),
    [competitorIcon]
  );

  if (loadError) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Text type="danger">Error loading map</Text>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">Loading map...</Text>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#1890ff',
                marginRight: 8,
              }}
            />
            <Text>Your Facility</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#f5222d',
                marginRight: 8,
              }}
            />
            <Text>Competitors</Text>
          </div>
        </Space>
      </div>

      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={defaultZoom} onLoad={onMapLoad}>
        {/* Facility markerF */}
        {facilityCoords && selectedFacility && (
          <MarkerF
            position={facilityCoords}
            title={selectedFacility.facility_name}
            icon={facilityIcon}
          />
        )}

        {/* Competitors */}
        {competitors.map((c, i) => {
          if (!c.latitude || !c.longitude) return null;
          const pos = { lat: parseFloat(c.latitude), lng: parseFloat(c.longitude) };
          const isHovered = hoveredCompetitor?.id === c.id;
          return (
            <MarkerF
              key={i}
              position={pos}
              title={c.store_name}
              icon={isHovered ? hoveredCompetitorIcon : competitorIcon}
              zIndex={isHovered ? 1000 : 1}
            />
          );
        })}
      </GoogleMap>

      <div style={{ marginTop: 16 }}>
        <Space wrap>
          <Tag
            color="blue"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => {
              // 2. Pan to facility when hovering facility card
              if (mapRef.current && facilityCoords) {
                mapRef.current.panTo(facilityCoords);
              }
            }}
          >
            Facility: {selectedFacility?.facility_name || 'Not selected'}
          </Tag>
          <Tag color="red">Total Competitors: {competitors.length}</Tag>
          {competitors.length > 0 && (
            <Tag color="orange">
              Avg Distance:{' '}
              {(
                competitors.reduce((sum, c) => sum + (parseFloat(c.distance) || 0), 0) /
                competitors.length
              ).toFixed(1)}{' '}
              mi
            </Tag>
          )}
          {hoveredCompetitor && (
            <Tag color="purple">
              {hoveredCompetitor.store_name}:{' '}
              {parseFloat(hoveredCompetitor.distance || 0).toFixed(1)} mi
            </Tag>
          )}
        </Space>
      </div>
    </div>
  );
}
