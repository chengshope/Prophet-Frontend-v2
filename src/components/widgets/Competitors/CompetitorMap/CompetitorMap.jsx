import { useEffect, useRef, useState } from 'react';
import { Card, Typography, Space, Tag } from 'antd';

const { Text } = Typography;

const CompetitorMap = ({
  competitors,
  selectedFacility,
  facilityCoords,
  mapCenter,
  onMapCenterChange,
  hoveredCompetitor,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Initialize Google Map
  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: 12,
      mapTypeId: 'roadmap',
    });

    setMap(mapInstance);

    // Listen for center changes
    mapInstance.addListener('center_changed', () => {
      const center = mapInstance.getCenter();
      onMapCenterChange({
        lat: center.lat(),
        lng: center.lng(),
      });
    });

    return () => {
      // Cleanup listeners
      window.google.maps.event.clearInstanceListeners(mapInstance);
    };
  }, [mapCenter, onMapCenterChange]);

  // Update markers when data changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers = [];

    // Add facility marker (if coordinates available)
    if (facilityCoords && selectedFacility) {
      const facilityMarker = new window.google.maps.Marker({
        position: facilityCoords,
        map: map,
        title: selectedFacility.facility_name,
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#1890ff" stroke="#fff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">F</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const facilityInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 8px 0; color: #1890ff;">${selectedFacility.facility_name}</h4>
            <p style="margin: 0; font-size: 12px;"><strong>Your Facility</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">${selectedFacility.address}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">${selectedFacility.city}, ${selectedFacility.state}</p>
          </div>
        `,
      });

      facilityMarker.addListener('click', () => {
        facilityInfoWindow.open(map, facilityMarker);
      });

      newMarkers.push(facilityMarker);
    }

    // Add competitor markers
    competitors.forEach((competitor, index) => {
      if (!competitor.latitude || !competitor.longitude) return;

      const position = {
        lat: parseFloat(competitor.latitude),
        lng: parseFloat(competitor.longitude),
      };

      const competitorMarker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: competitor.store_name,
        icon: {
          url:
            'data:image/svg+xml;charset=UTF-8,' +
            encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#f5222d" stroke="#fff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">C</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const infoContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #f5222d;">${competitor.store_name}</h4>
          ${competitor.address ? `<p style="margin: 0; font-size: 12px;">${competitor.address}</p>` : ''}
          ${competitor.distance ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Distance:</strong> ${parseFloat(competitor.distance).toFixed(1)} mi</p>` : ''}
          ${competitor.unit_type ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Unit Type:</strong> ${competitor.unit_type}</p>` : ''}
          ${competitor.size ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Size:</strong> ${competitor.size} sq ft</p>` : ''}
          ${competitor.rate ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Rate:</strong> $${parseFloat(competitor.rate).toFixed(2)}</p>` : ''}
          ${competitor.climate_controlled !== null ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Climate Controlled:</strong> ${competitor.climate_controlled ? 'Yes' : 'No'}</p>` : ''}
          ${competitor.phone ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Phone:</strong> ${competitor.phone}</p>` : ''}
          ${competitor.website ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Website:</strong> <a href="${competitor.website}" target="_blank">Visit</a></p>` : ''}
        </div>
      `;

      const competitorInfoWindow = new window.google.maps.InfoWindow({
        content: infoContent,
      });

      competitorMarker.addListener('click', () => {
        competitorInfoWindow.open(map, competitorMarker);
      });

      newMarkers.push(competitorMarker);
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);

      // Ensure minimum zoom level
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        window.google.maps.event.removeListener(listener);
      });
    }

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, competitors, facilityCoords, selectedFacility]);

  // Show loading message if Google Maps is not loaded
  if (!window.google) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Text type="secondary">Loading map...</Text>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Map Legend */}
      <div style={{ marginBottom: '16px' }}>
        <Space>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#1890ff',
                marginRight: '8px',
              }}
            />
            <Text>Your Facility</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#f5222d',
                marginRight: '8px',
              }}
            />
            <Text>Competitors</Text>
          </div>
        </Space>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '6px',
          border: '1px solid #d9d9d9',
        }}
      />

      {/* Map Statistics */}
      <div style={{ marginTop: '16px' }}>
        <Space>
          <Tag color="blue">Facility: {selectedFacility?.facility_name || 'Not selected'}</Tag>
          <Tag color="red">Competitors: {competitors.length}</Tag>
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
        </Space>
      </div>
    </div>
  );
};

export default CompetitorMap;
