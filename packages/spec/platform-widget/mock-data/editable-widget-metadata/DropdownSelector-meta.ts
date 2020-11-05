import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const DropdownSelectorMeta: EditableWidgetMeta = {
  id: 'widget-id-5',
  label: '下拉选择器',
  widgetRef: 'DropdownSelector',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_widget_coding', editAttr: ['widgetCode'] },
      { propID: 'prop_options_selector', editAttr: ['options'] },
      { propID: 'prop_style_title_color', editAttr: 'labelColor' },
      {
        propID: 'prop_title_value',
        editAttr: ['title'],
        defaultValues: {
          title: '下拉选择'
        },
      },
      { propID: 'prop_field', editAttr: ['field'] },
      // { propID: 'prop_flex_config' },
    ]
  }
};
