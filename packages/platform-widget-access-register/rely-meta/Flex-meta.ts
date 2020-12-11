import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FlexMeta = CreateWidgetPropItemRely({
  widgetRef: 'FlexLayout',
  wGroupType: 'layout',
  label: 'Flex 布局',
  acceptChildStrategy: {
    strategy: 'blackList',
    blackList: []
  },
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_style_title_color' },
      { propID: 'prop_flex_config' },
    ]
  }
});
