import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const FlexMeta: EditableWidgetMeta = {
  id: 'con1',
  widgetRef: 'FlexLayout',
  label: 'Flex 布局',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_style_title_color' },
      { propID: 'prop_flex_config' },
    ]
  }
};
