import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const FormInputMeta: EditableWidgetMeta = {
  id: 'widget-id-1',
  label: '文本框',
  widgetRef: 'FormInput',
  varAttr: [{
    alias: '实际值',
    attr: 'realVal',
    type: 'string'
  }, {
    alias: '显示值',
    attr: 'showVal',
    type: 'string'
  }],
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_widget_coding', editAttr: ['widgetCode'] },
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
