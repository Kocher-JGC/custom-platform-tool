import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FormInputNumberMeta = CreateWidgetPropItemRely({
  id: 'widget-form-input-number',
  label: '数字框',
  widgetRef: 'FormInputNumber',
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
      {
        propID: 'prop_title_value',
        editAttr: ['title'],
        defaultValues: {
          title: '数字框'
        },
      },
      { propID: 'prop_widget_type', editAttr: ['widgetType'] },
      { propID: 'prop_data_type', editAttr: ['dataType'] },
      { propID: 'prop_string_length', editAttr: ['stringLength'] },
      { propID: 'prop_prompt_info', editAttr: ['promptInfo'] },
      { propID: 'prop_note_info', editAttr: ['noteInfo'] },
      { propID: 'prop_number_max', editAttr: ['max'] },
      { propID: 'prop_number_min', editAttr: ['mix'] },
      { propID: 'prop_number_radixPoint', editAttr: ['radixPoint'] },
      { propID: 'prop_check_fixed_rule', editAttr: ['checkFixedRule'] },
      { propID: 'prop_check_custom_rule', editAttr: ['checkCustomRule'] },
      { propID: 'prop_check_tooltip', editAttr: ['checkTooltip'] },
      { propID: 'prop_field', editAttr: ['field'] }
    ]
  }
});
