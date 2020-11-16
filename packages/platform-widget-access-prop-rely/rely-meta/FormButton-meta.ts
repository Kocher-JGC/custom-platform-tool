import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const FormButtonMeta: EditableWidgetMeta = {
  id: 'widget-form-button',
  widgetRef: 'FormButton',
  label: '动作按钮',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_title_value', editAttr: 'title', defaultValues: { title: '提交' } },
      { propID: 'prop_action_config', editAttr: ['actions'] },
    ]
  }
};
