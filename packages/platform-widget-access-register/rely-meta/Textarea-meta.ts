import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const TextareaMeta = CreateWidgetPropItemRely({
  id: 'widget-id-11',
  label: '多行文本框',
  wGroupType: 'formController',
  widgetRef: 'Textarea',
  eventAttr: [
    { alias: '值改变事件', type: 'onChange' },
    { alias: '鼠标移入事件', type: 'onMouseIn' },
    { alias: '鼠标移除事件', type: 'onMouseOut' },
  ],
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
      { propID: 'prop_action_config', editAttr: ['eventRef'] },
    ]
  }
});
