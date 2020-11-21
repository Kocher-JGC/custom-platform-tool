import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const DropdownSelectorMeta = CreateWidgetPropItemRely({
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
      { propID: 'prop_dropdown_multiple' },
      { propID: 'prop_start_search' },
      { propID: 'prop_check_fixed_rule', editAttr: ['checkFixedRule'] },
      { propID: 'prop_check_custom_rule', editAttr: ['checkCustomRule'] },
      { propID: 'prop_check_tooltip', editAttr: ['checkTooltip'] },
      // { propID: 'prop_flex_config' },
    ]
  }
});
