import { Card, Flex, Spin, Typography } from 'antd';

const { Title, Text } = Typography;

const SettingGroup = ({
  title,
  description,
  children,
  style = {},
  titleLevel = 5,
  gap = 16,
  loading = false,
  ...props
}) => {
  return (
    <Card.Grid
      style={{
        width: '100%',
        borderRadius: 6,
        ...style,
      }}
      hoverable={false}
      {...props}
    >
      <Spin spinning={loading}>
        <Flex vertical gap={gap}>
          <Flex align="center" gap={12}>
            <Title level={titleLevel} style={{ margin: 0 }}>
              {title}
            </Title>
            {description && (
              <Text style={{ paddingTop: 3 }} type="secondary">
                {description}
              </Text>
            )}
          </Flex>
          <Flex vertical justify="center">
            {children}
          </Flex>
        </Flex>
      </Spin>
    </Card.Grid>
  );
};

export default SettingGroup;
