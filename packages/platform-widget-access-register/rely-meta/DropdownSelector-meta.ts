import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const DropdownSelectorMeta = CreateWidgetPropItemRely({
  id: 'widget-id-5',
  label: '下拉选择器',
  widgetRef: 'DropdownSelector',
  wGroupType: 'formController',
  eventAttr: [
    { alias: '值选中事件', type: 'onChange' },
    { alias: '鼠标移入事件', type: 'onMouseIn' },
    { alias: '鼠标移除事件', type: 'onMouseOut' },
  ],
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
      { propID: 'prop_check_error_tooltip', editAttr: ['checkErrorTooltip'] },
      { propID: 'prop_action_config', editAttr: ['eventRef'] },
      // { propID: 'prop_flex_config' },
    ]
  }
});
