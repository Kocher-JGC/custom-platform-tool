import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const FormButtonMeta = CreateWidgetPropItemRely({
  id: 'widget-form-button',
  widgetRef: 'FormButton',
  label: '动作按钮',
  eventAttr: [
    { alias: '单击事件', type: 'onClick' },
    { alias: '双击事件', type: 'onDbClick' },
  ],
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_title_value', editAttr: 'title', defaultValues: { title: '提交' } },
      { propID: 'prop_action_config', editAttr: ['actions'] },
    ]
  }
});
