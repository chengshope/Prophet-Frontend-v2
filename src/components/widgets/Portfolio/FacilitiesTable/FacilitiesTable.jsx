import {
  useGetPortfolioFacilitiesQuery,
  useUpdateCompetitorStoreMutation,
  useUpdateFacilityStorTrackMutation,
} from '@/api/portfolioApi';
import { useLookupStorTrackMutation } from '@/api/settingsApi';
import { selectPortfolioId } from '@/features/auth/authSelector';
import { showError, showSuccess } from '@/utils/messageService';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Card, Space, Spin, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import StorTrackModal from '../Modal/StorTrackModal';
import { getFacilityTableColumns } from '../tableColumns';

const FacilitiesTable = ({ portfolioId, onRefetch }) => {
  const [facilities, setFacilities] = useState([]);
  const [storTrackModalVisible, setStorTrackModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);

  const currentPortfolioId = useSelector(selectPortfolioId);
  const activePortfolioId = portfolioId || currentPortfolioId;

  // API hooks
  const { data: facilitiesList, isLoading: facilitiesLoading } = useGetPortfolioFacilitiesQuery(
    activePortfolioId,
    {
      skip: !activePortfolioId,
    }
  );

  const [lookupStorTrack] = useLookupStorTrackMutation();
  const [updateFacilityStorTrack, { isLoading: updatingStorTrack }] =
    useUpdateFacilityStorTrackMutation();
  const [updateCompetitorStore] = useUpdateCompetitorStoreMutation();

  // Load facilities from API
  useEffect(() => {
    if (facilitiesList) {
      setFacilities(facilitiesList);
    }
  }, [facilitiesList]);

  // Handlers
  const handleStorTrackLookup = useCallback((facility) => {
    if (!facility.latitude || !facility.longitude) {
      showError('Facility latitude and longitude is required');
      return;
    }

    setSelectedFacility(facility);
    setStorTrackModalVisible(true);
  }, []);

  const performStorTrackLookup = useCallback(
    async (facility) => {
      if (!facility?.latitude || !facility?.longitude) {
        showError('Facility coordinates are required');
        return;
      }

      setLoadingStores(true);
      try {
        const response = await lookupStorTrack({
          latitude: facility.latitude,
          longitude: facility.longitude,
          radius: facility.comp_stores_info?.distance || 5,
        }).unwrap();

        console.log('StorTrack API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Is Array:', Array.isArray(response));

        // Handle different response structures
        let stores = [];
        if (Array.isArray(response)) {
          stores = response;
        } else if (response && typeof response === 'object') {
          // Check common nested properties
          stores = response.stores || response.data || response.result || [];
        }

        console.log('Processed stores:', stores);
        setNearbyStores(stores);
      } catch (error) {
        console.error('StorTrack lookup error:', error);
        showError('Failed to lookup StorTrack stores');
        setNearbyStores([]);
      } finally {
        setLoadingStores(false);
      }
    },
    [lookupStorTrack]
  );

  const handleStorTrackConfirm = useCallback(
    async (data) => {
      if (!data || !data.store) {
        showError('Please select a store');
        return;
      }

      const { facility, store, radius } = data;

      try {
        await updateCompetitorStore({
          storeid: store.storeid,
          storeData: { ...store, radius },
        }).unwrap();

        await updateFacilityStorTrack({
          facilityId: facility.id,
          stortrack_id: store.masterid,
          radius,
        }).unwrap();

        showSuccess('StorTrack settings updated successfully!');
        setStorTrackModalVisible(false);
        setSelectedFacility(null);
        setNearbyStores([]);

        // Notify parent to refetch if needed
        if (onRefetch) {
          onRefetch();
        }
      } catch (error) {
        console.error('StorTrack update error:', error);
        showError('Failed to update StorTrack settings');
      }
    },
    [updateFacilityStorTrack, updateCompetitorStore, onRefetch]
  );

  const columns = getFacilityTableColumns(handleStorTrackLookup);

  return (
    <>
      <Card
        title={
          <Space>
            <EnvironmentOutlined />
            StorTrack
          </Space>
        }
        className="page-card"
        styles={{ body: { padding: '1px 0 0' } }}
      >
        <Spin spinning={facilitiesLoading || updatingStorTrack} tip="Loading facilities...">
          <Table
            columns={columns}
            dataSource={facilities}
            rowKey={(record, index) => `facility-${index}`}
            pagination={false}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>

      {/* StorTrack Modal */}
      <StorTrackModal
        open={storTrackModalVisible}
        onCancel={() => {
          setStorTrackModalVisible(false);
          setSelectedFacility(null);
          setNearbyStores([]);
        }}
        onConfirm={handleStorTrackConfirm}
        confirmLoading={updatingStorTrack}
        selectedFacility={selectedFacility}
        nearbyStores={nearbyStores}
        loadingStores={loadingStores}
        onLookupStores={performStorTrackLookup}
      />
    </>
  );
};

export default FacilitiesTable;
