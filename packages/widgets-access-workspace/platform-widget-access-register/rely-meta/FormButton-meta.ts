import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FormButtonMeta = CreateWidgetPropItemRely({
  widgetRef: 'FormButton',
  label: '动作按钮',
  wGroupType: 'formController',
  eventAttr: [
    { alias: '单击事件', type: 'onClick' },
    { alias: '双击事件', type: 'onDbClick' },
    { alias: '鼠标移入事件', type: 'onMouseIn' },
    { alias: '鼠标移除事件', type: 'onMouseOut' },
  ],
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_title_value', editAttr: 'title', defaultValues: { title: '提交' } },
      { propID: 'prop_action_config', editAttr: ['eventRef'] },
    ]
  }
});