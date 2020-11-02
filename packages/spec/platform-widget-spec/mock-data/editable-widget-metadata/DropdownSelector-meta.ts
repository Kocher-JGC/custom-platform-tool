import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const DropdownSelectorMeta: EditableWidgetMeta = {
  id: 'widget-id-5',
  label: '下拉选择器',
  widgetRef: 'DropdownSelector',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_style_title_color', editAttr: 'title' },
      // { propID: 'prop_flex_config' },
    ]
  }
};
