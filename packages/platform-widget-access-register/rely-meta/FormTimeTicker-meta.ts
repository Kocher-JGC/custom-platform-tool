import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FormTimeTickerMeta = CreateWidgetPropItemRely({
  id: 'widget-form-time-ticker',
  label: '时间框',
  widgetRef: 'FormTimeTicker',
  wGroupType: 'formController',
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
      { propID: 'prop_check_fixed_rule', editAttr: ['checkFixedRule'] },
      { propID: 'prop_check_custom_rule', editAttr: ['checkCustomRule'] },
      { propID: 'prop_check_error_tooltip', editAttr: ['checkErrorTooltip'] },
      { propID: 'prop_widget_type', editAttr: ['widgetType'] },
      { propID: 'prop_field_type', editAttr: ['fieldType'] },
      { propID: 'prop_data_type', editAttr: ['dataType'] },
      { propID: 'prop_real_value', editAttr: ['realVal', 'exp', 'variable'] },
      { propID: 'prop_string_length', editAttr: ['stringLength'] },
      { propID: 'prop_prompt_info', editAttr: ['promptInfo'] },
      { propID: 'prop_note_info', editAttr: ['noteInfo'] },
      // { propID: 'prop_real_value', editAttr: ['realVal', 'exp', 'variable'] },
      // { propID: 'prop_field', editAttr: ['field'] },
    ]
  }
});
