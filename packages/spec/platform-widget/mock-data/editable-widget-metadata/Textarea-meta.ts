import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const TextareaMeta: EditableWidgetMeta = {
  id: 'widget-id-11',
  label: '多行文本框',
  widgetRef: 'Textarea',
  varAttr: ['title', 'labelColor', 'realVal'],
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_style_title_color', editAttr: ['labelColor'] },
      {
        propID: 'prop_title_value',
        editAttr: ['title'],
        defaultValues: {
          title: '文本框'
        },
      },
      { propID: 'prop_real_value', editAttr: ['realVal', 'exp', 'variable'] },
      { propID: 'prop_field', editAttr: ['field'] },
    ]
  }
};
