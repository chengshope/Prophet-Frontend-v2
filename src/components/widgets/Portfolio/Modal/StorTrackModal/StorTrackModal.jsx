import { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Button, Spin, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

/**
 * Modal for StorTrack lookup and configuration
 * Following Rule #4: Modal components under Portfolio/Modal/
 */
const StorTrackModal = ({
  open,
  onCancel,
  onConfirm,
  confirmLoading,
  selectedFacility = null,
  nearbyStores = [],
  loadingStores = false,
  onLookupStores,
}) => {
  const [form] = Form.useForm();
  const [selectedStore, setSelectedStore] = useState(null);
  const [radius, setRadius] = useState(1);

  useEffect(() => {
    if (open && selectedFacility) {
      // Reset form when modal opens
      form.resetFields();
      setSelectedStore(null);
      setRadius(1);

      // Trigger lookup if facility has coordinates
      if (selectedFacility.latitude && selectedFacility.longitude && onLookupStores) {
        onLookupStores(selectedFacility);
      }
    }
  }, [open, selectedFacility, onLookupStores, form]);

  useEffect(() => {
    // Pre-select existing store if available
    if (nearbyStores.length > 0 && selectedFacility?.comp_stores_info?.s_id) {
      const existingStore = nearbyStores.find(
        (store) => store.storeid === selectedFacility.comp_stores_info.s_id
      );
      if (existingStore) {
        setSelectedStore(existingStore.storeid);
        setRadius(selectedFacility.comp_stores_info.distance || 1);
        form.setFieldsValue({
          store_id: existingStore.storeid,
          radius: selectedFacility.comp_stores_info.distance || 1,
        });
      }
    }
  }, [nearbyStores, selectedFacility, form]);

  const handleStoreChange = (storeId) => {
    setSelectedStore(storeId);
    const store = nearbyStores.find((s) => s.storeid === storeId);
    if (store) {
      // Auto-set radius based on existing facility data if available
      const existingRadius = selectedFacility?.comp_stores_info?.distance;
      if (existingRadius) {
        setRadius(existingRadius);
        form.setFieldValue('radius', existingRadius);
      }
    }
  };

  const handleRadiusChange = (value) => {
    setRadius(value);
  };

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      const selectedStoreData = nearbyStores.find((store) => store.storeid === values.store_id);
      onConfirm({
        facility: selectedFacility,
        store: selectedStoreData,
        radius: values.radius,
      });
    });
  };

  return (
    <Modal
      title={`StorTrack Settings - ${selectedFacility?.facility_name || ''}`}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          loading={confirmLoading}
          disabled={!selectedStore || !radius}
        >
          Confirm
        </Button>,
      ]}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="StorTrack Store"
          name="store_id"
          rules={[{ required: true, message: 'Please select a store' }]}
        >
          <Select
            placeholder={loadingStores ? 'Loading nearby stores...' : 'Select a nearby store'}
            value={selectedStore}
            onChange={handleStoreChange}
            showSearch
            loading={loadingStores}
            disabled={loadingStores}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            notFoundContent={
              loadingStores ? (
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <Spin size="small" />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Loading nearby stores...
                    </Text>
                  </div>
                </div>
              ) : (
                <Text type="secondary">No nearby stores found</Text>
              )
            }
          >
            {nearbyStores.map((store) => (
              <Option key={store.storeid} value={store.storeid}>
                {store.storename} - {store.address}, {store.city}, {store.state}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="StorTrack Radius for Competitors"
          name="radius"
          rules={[
            { required: true, message: 'Please enter radius' },
            { type: 'number', min: 0.1, message: 'Radius must be greater than 0' },
          ]}
        >
          <InputNumber
            min={0.1}
            max={50}
            step={0.1}
            placeholder="Enter radius in miles"
            value={radius}
            onChange={handleRadiusChange}
            style={{ width: '100%' }}
            disabled={loadingStores}
          />
        </Form.Item>

        {selectedFacility && !selectedFacility.latitude && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: '#fff2e8',
              border: '1px solid #ffbb96',
              borderRadius: 4,
            }}
          >
            <Text type="warning">
              This facility doesn't have latitude/longitude coordinates. Please add coordinates to
              enable StorTrack lookup.
            </Text>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default StorTrackModal;
