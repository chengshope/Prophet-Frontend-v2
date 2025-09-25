import { Form, Button, Upload, Space } from 'antd';
import { BulbOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import SettingGroup from '@/components/common/SettingGroup';
import FormLabel from '@/components/common/FormLabel';
import { showError, showSuccess } from '@/utils/messageService';
import {
  useUploadUnitRankingMutation,
  useLazyDownloadSampleXLSXQuery,
  useLazyExportUnitRankingQuery,
} from '@/api/settingsApi';

const UnitRankingUpload = ({ facilityId, facilitySettings }) => {
  // API mutations
  const [uploadUnitRanking] = useUploadUnitRankingMutation();
  const [downloadSampleXLSX] = useLazyDownloadSampleXLSXQuery();
  const [exportUnitRanking] = useLazyExportUnitRankingQuery();

  // Handle unit ranking file upload
  const handleUnitRankingUpload = async (file) => {
    const { facility_id } = facilitySettings;
    if (!facility_id) {
      showError('No facility selected');
      return;
    }
    try {
      await uploadUnitRanking({ facilityId: facility_id, file }).unwrap();
      showSuccess('Unit ranking uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      showError('Failed to upload unit ranking');
    }
  };

  // Handle sample download
  const handleDownloadSample = async () => {
    const { facility_id } = facilitySettings;

    if (!facility_id) {
      showError('No facility selected');
      return;
    }
    try {
      const result = await downloadSampleXLSX(facility_id).unwrap();
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'unit_ranking_sample.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download sample');
    }
  };

  // Handle export ranking
  const handleExportRanking = async () => {
    const { facility_id } = facilitySettings;

    if (!facility_id) {
      showError('No facility selected');
      return;
    }
    try {
      const result = await exportUnitRanking(facility_id).unwrap();
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'unit_ranking_export.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export unit ranking');
    }
  };

  return (
    <SettingGroup
      title="Unit Ranking Upload"
      description="Upload unit ranking data for this facility."
    >
      <Form.Item
        label={
          <FormLabel
            icon={<BulbOutlined />}
            label="Unit Ranking Upload"
            tooltip="Unit Ranking Upload."
            iconColor="#fa8c16"
          />
        }
        style={{ marginBottom: 0 }}
      >
        <Space wrap>
          <Upload
            accept=".xlsx"
            showUploadList={false}
            beforeUpload={(file) => {
              handleUnitRankingUpload(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} style={{ width: '100%' }} block>
              Click Here To Upload Your Unit Ranking
            </Button>
          </Upload>
          <Button icon={<DownloadOutlined />} onClick={handleExportRanking}>
            Click Here To Export Unit Ranking
          </Button>
          <Button type="link" icon={<DownloadOutlined />} onClick={handleDownloadSample}>
            Download Sample XLSX
          </Button>
        </Space>
      </Form.Item>
    </SettingGroup>
  );
};

export default UnitRankingUpload;
