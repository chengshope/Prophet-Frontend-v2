import AppFooter from '@/layouts/MainLayout/Footer';
import { PageContainer } from '@ant-design/pro-layout';
import { PageHeader } from '@ant-design/pro-layout/es';
import { Card } from 'antd';
import './PageFrame.less';

const PageFrame = ({ children, title = 'Page', extra = [] }) => {
  return (
    <PageContainer
      className="page-container"
      header={{
        breadcrumb: false,
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
