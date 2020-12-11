import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FormInputNumberMeta = CreateWidgetPropItemRely({
  label: '数字框',
  widgetRef: 'FormInputNumber',
  wGroupType: 'formController',
  eventAttr: [
    { alias: '值改变事件', type: 'onChange' },
    { alias: '鼠标移入事件', type: 'onMouseIn' },
    { alias: '鼠标移除事件', type: 'onMouseOut' },
  ],
  varAttr: [{
    alias: '实际值',
    attr: 'realVal',
    type: 'number'
  }, {
    alias: '显示值',
    attr: 'showVal',
    type: 'string'
  }],
  propItemsRely: {
    propItemRefs: [
      {
        propID: 'prop_title_value',
        editAttr: ['title'],
        defaultValues: {
          title: '数字框'
        },
      },
      {
        propID: 'prop_unit_value',
        editAttr: ['unit']
      },
      { propID: 'prop_widget_coding', editAttr: ['widgetCode'] },
      { propID: 'prop_widget_type', editAttr: ['widgetType'] },
      { propID: 'prop_field_type', editAttr: ['fieldType'] },
      { propID: 'prop_data_type', editAttr: ['dataType'] },
      { propID: 'prop_string_length', editAttr: ['stringLength'] },
      { propID: 'prop_prompt_info', editAttr: ['promptInfo'] },
      { propID: 'prop_note_info', editAttr: ['noteInfo'] },
      { propID: 'prop_number_max', editAttr: ['max'] },
      { propID: 'prop_number_min', editAttr: ['mix'] },
      { propID: 'prop_number_radixPoint', editAttr: ['radixPoint'] },
      { propID: 'prop_check_fixed_rule', editAttr: ['checkFixedRule'] },
      { propID: 'prop_check_custom_rule', editAttr: ['checkCustomRule'] },
      { propID: 'prop_check_error_tooltip', editAttr: ['checkErrorTooltip'] },
      { propID: 'prop_real_value', editAttr: ['realVal', 'exp', 'variable'] },
      { propID: 'prop_field', editAttr: ['field'] },
      { propID: 'prop_action_config', editAttr: ['eventRef'] },
    ]
  }
});
