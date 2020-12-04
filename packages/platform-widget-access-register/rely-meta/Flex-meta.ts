import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FlexMeta = CreateWidgetPropItemRely({
  id: 'con1',
  widgetRef: 'FlexLayout',
  wGroupType: 'layout',
  label: 'Flex 布局',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_style_title_color' },
      { propID: 'prop_flex_config' },
    ]
  }
});
