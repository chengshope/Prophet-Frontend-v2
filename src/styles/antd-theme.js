// Ant Design theme configuration
export const lightTheme = {
  token: {
    // Primary colors
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    // Background colors
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    // Use dark tooltip background in light mode for readability
    colorBgSpotlight: 'rgba(0, 0, 0, 0.85)',

    // Border
    borderRadius: 6,
    borderRadiusLG: 6,
    borderRadiusSM: 3,
    borderRadiusXS: 2,

    // Typography
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Text colors
    colorText: 'rgba(0, 0, 0, 0.88)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',

    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,
    paddingSM: 12,
    paddingXS: 8,

    margin: 16,
    marginLG: 24,
    marginXL: 32,
    marginSM: 12,
    marginXS: 8,

    // Layout
    sizeStep: 4,
    sizeUnit: 4,

    // Animation
    motionDurationFast: '0.1s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',

    // Box shadow
    boxShadow:
      '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    boxShadowSecondary:
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
  },

  components: {
    // Button customization
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 16,
      paddingInlineLG: 24,
      paddingInlineSM: 12,
      fontWeight: 500,
    },

    // Input customization
    Input: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
      colorText: 'rgba(0, 0, 0, 0.88)',
      colorTextPlaceholder: 'rgba(0, 0, 0, 0.45)',
      colorIcon: 'rgba(0, 0, 0, 0.45)',
      colorIconHover: 'rgba(0, 0, 0, 0.65)',
    },

    // Card customization
    Card: {
      borderRadius: 12,
      paddingLG: 24,
      headerBg: 'transparent',
      headerHeight: 56,
    },

    // Form customization
    Form: {
      labelFontSize: 14,
      labelColor: 'rgba(0, 0, 0, 0.85)',
      labelRequiredMarkColor: '#ff4d4f',
      itemMarginBottom: 24,
      verticalLabelPadding: '0 0 8px',
    },

    // Layout customization
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#ffffff',
      triggerBg: '#ffffff',
      triggerColor: 'rgba(0, 0, 0, 0.65)',
    },

    // Menu customization
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
      itemHoverBg: '#f5f5f5',
      itemHoverColor: '#1890ff',
      itemActiveBg: '#e6f7ff',
      itemPaddingInline: 16,
      itemMarginInline: 8,
      itemBorderRadius: 8,
      iconSize: 16,
      fontSize: 14,
    },

    // Table customization
    Table: {
      borderRadius: 8,
      headerBg: '#fafafa',
      headerColor: 'rgba(0, 0, 0, 0.85)',
      headerSortActiveBg: '#f0f0f0',
      bodySortBg: '#fafafa',
      rowHoverBg: '#f5f5f5',
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
    },

    // Modal customization
    Modal: {
      borderRadius: 12,
      headerBg: 'transparent',
      contentBg: '#ffffff',
      titleFontSize: 18,
      titleColor: 'rgba(0, 0, 0, 0.85)',
    },

    // Drawer customization
    Drawer: {
      borderRadius: 0,
      headerHeight: 56,
      bodyPadding: 24,
      footerPaddingBlock: 16,
      footerPaddingInline: 24,
    },

    // Typography customization
    Typography: {
      titleMarginBottom: '0.5em',
      titleMarginTop: '1.2em',
    },

    // Notification customization
    Notification: {
      borderRadius: 8,
      paddingInline: 24,
      paddingBlock: 16,
    },

    // Message customization
    Message: {
      borderRadius: 8,
      paddingInline: 16,
      paddingBlock: 12,
    },

    // Breadcrumb customization
    Breadcrumb: {
      fontSize: 14,
      iconFontSize: 14,
      linkColor: 'rgba(0, 0, 0, 0.45)',
      linkHoverColor: '#1890ff',
      separatorColor: 'rgba(0, 0, 0, 0.45)',
      separatorMargin: 8,
    },

    // Steps customization
    Steps: {
      iconSize: 32,
      iconSizeSM: 24,
      dotSize: 8,
      titleLineHeight: 1.5,
      descriptionMaxWidth: 140,
    },

    // Tabs customization
    Tabs: {
      itemColor: 'rgba(0, 0, 0, 0.65)',
      itemSelectedColor: '#1890ff',
      itemHoverColor: '#1890ff',
      itemActiveColor: '#1890ff',
      cardBg: '#fafafa',
      cardHeight: 40,
      cardPadding: '8px 16px',
      cardPaddingSM: '6px 12px',
      cardPaddingLG: '12px 20px',
    },

    // Select customization - match Input padding
    Select: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // Segmented customization - match Input/Button padding
    Segmented: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      itemSelectedBg: '#1890ff',
      itemSelectedColor: '#ffffff',
      itemHoverBg: '#f5f5f5',
      itemHoverColor: 'rgba(0, 0, 0, 0.88)',
      itemActiveBg: '#e6f7ff',
      itemActiveColor: '#1890ff',
      trackBg: '#f5f5f5',
      trackPadding: 2,
    },

    // DatePicker customization - match Input padding
    DatePicker: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // TimePicker customization - match Input padding
    TimePicker: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // InputNumber customization - match Input padding
    InputNumber: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // AutoComplete customization - match Input padding
    AutoComplete: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // Cascader customization - match Input padding
    Cascader: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // TreeSelect customization - match Input padding
    TreeSelect: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },

    // Mentions customization - match Input padding
    Mentions: {
      borderRadius: 6,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingInline: 12,
      paddingInlineLG: 16,
      paddingInlineSM: 8,
    },
  },

  // CSS variables for custom styling
  cssVar: true,
  hashed: false,
};

// Dark theme configuration
export const darkTheme = {
  ...lightTheme,
  algorithm: 'dark',
  token: {
    ...lightTheme.token,
    // Dark mode colors
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    colorBgLayout: '#000000',
    colorBgSpotlight: '#262626',
    colorText: 'rgba(255, 255, 255, 0.85)',
    colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
    colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
    colorBorder: '#434343',
    colorBorderSecondary: '#303030',
    colorTextLabel: '#c0c4cc',
  },
  components: {
    ...lightTheme.components,
    Input: {
      ...lightTheme.components.Input,
      colorText: 'rgba(255, 255, 255, 0.88)',
      colorTextPlaceholder: 'rgba(255, 255, 255, 0.45)',
      colorIcon: 'rgba(255, 255, 255, 0.45)',
      colorIconHover: 'rgba(255, 255, 255, 0.65)',
    },
    Select: {
      ...lightTheme.components.Select,
    },
    Segmented: {
      ...lightTheme.components.Segmented,
      itemSelectedBg: '#1890ff',
      itemSelectedColor: '#ffffff',
      itemHoverBg: '#262626',
      itemHoverColor: 'rgba(255, 255, 255, 0.88)',
      itemActiveBg: '#1890ff',
      itemActiveColor: '#ffffff',
      trackBg: '#262626',
    },
    DatePicker: {
      ...lightTheme.components.DatePicker,
    },
    TimePicker: {
      ...lightTheme.components.TimePicker,
    },
    InputNumber: {
      ...lightTheme.components.InputNumber,
    },
    AutoComplete: {
      ...lightTheme.components.AutoComplete,
    },
    Cascader: {
      ...lightTheme.components.Cascader,
    },
    TreeSelect: {
      ...lightTheme.components.TreeSelect,
    },
    Mentions: {
      ...lightTheme.components.Mentions,
    },
    Layout: {
      ...lightTheme.components.Layout,
      headerBg: '#141414',
      siderBg: '#141414',
      triggerBg: '#141414',
      triggerColor: 'rgba(255, 255, 255, 0.65)',
    },
    Menu: {
      ...lightTheme.components.Menu,
      itemBg: 'transparent',
      itemSelectedBg: '#1890ff',
      itemSelectedColor: '#ffffff',
      itemHoverBg: '#262626',
      itemHoverColor: 'rgba(255, 255, 255, 0.88)',
      itemActiveBg: '#1890ff',
      itemActiveColor: '#ffffff',
    },
    Card: {
      ...lightTheme.components.Card,
      headerBg: 'transparent',
    },
    Table: {
      ...lightTheme.components.Table,
      headerBg: '#1f1f1f',
      headerColor: 'rgba(255, 255, 255, 0.85)',
      headerSortActiveBg: '#262626',
      bodySortBg: '#1f1f1f',
      rowHoverBg: '#262626',
    },
    Form: {
      ...lightTheme.components.Form,
      labelColor: 'rgba(255, 255, 255, 0.85)',
      labelFontSize: 14,
      labelRequiredMarkColor: '#ff4d4f',
    },
  },
};

// Default theme (light)
export const antdTheme = lightTheme;

// Theme getter function
export const getTheme = (isDark = false) => {
  return isDark ? darkTheme : lightTheme;
};
