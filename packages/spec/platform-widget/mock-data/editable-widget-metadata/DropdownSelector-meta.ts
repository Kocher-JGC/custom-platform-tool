import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const DropdownSelectorMeta: EditableWidgetMeta = {
  id: 'widget-id-5',
  label: '下拉选择器',
  widgetRef: 'DropdownSelector',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_widget_coding' },
      { propID: 'prop_datasource_selector' },
      { propID: 'prop_style_title_color' },
      {
        propID: 'prop_title_value',
        defaultValues: {
          title: '下拉选择'
        },
      },
      { propID: 'prop_field' },
      // { propID: 'prop_flex_config' },
    ]
  }
};
