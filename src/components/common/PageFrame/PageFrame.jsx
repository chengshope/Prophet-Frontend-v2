import { PageContainer } from '@ant-design/pro-layout';
import { PageHeader } from '@ant-design/pro-layout/es';
import { Card } from 'antd';
import './PageFrame.less';
import AppFooter from '@/layouts/MainLayout/Footer';

const PageFrame = ({ children, title = 'Page', extra = [] }) => {
  return (
    <PageContainer
      className="page-container"
      header={{
        breadcrumb: false, // Breadcrumb is now in the main header
      }}
    >
      <Card className="page-container-card">
        <PageHeader title={title} className="page-container-header" extra={extra} />
        {children}
      </Card>
      <AppFooter />
    </PageContainer>
  );
};

export default PageFrame;
