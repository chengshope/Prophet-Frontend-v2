import { Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormLabel = ({
  icon,
  label,
  tooltip,
  iconColor = '#52c41a',
  tooltipColor = '#1890ff',
  iconStyle = {},
  tooltipStyle = {},
  style = {},
  className = '',
  ...props
}) => {
  return (
    <span className={className} style={style} {...props}>
      {icon && (
        <span
          style={{
            marginRight: 8,
            color: iconColor,
            ...iconStyle,
          }}
        >
          {icon}
        </span>
      )}
      {label}
      {tooltip && (
        <Tooltip title={tooltip}>
          <InfoCircleOutlined
            style={{
              marginLeft: 8,
              color: tooltipColor,
              ...tooltipStyle,
            }}
          />
        </Tooltip>
      )}
    </span>
  );
};

export default FormLabel;
