import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FormTimeTickerMeta = CreateWidgetPropItemRely({
  id: 'widget-form-time-ticker',
  label: '时间框',
  widgetRef: 'FormTimeTicker',
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
          title: '时间框'
        },
      },
      // { propID: 'prop_real_value', editAttr: ['realVal', 'exp', 'variable'] },
      // { propID: 'prop_field', editAttr: ['field'] },
    ]
  }
});
