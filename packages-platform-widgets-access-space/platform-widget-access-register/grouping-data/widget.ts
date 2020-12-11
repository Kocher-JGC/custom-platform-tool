import { GroupPanelData } from "@engine/visual-editor/components/GroupPanel";

export const widgetPanelData: GroupPanelData = {
  title: '控件类型',
  type: 'dragableItems',
  itemsGroups: [
    {
      title: '通用',
      type: '',
      items: [
        'FormButton',
      ]
    },
    {
      title: '表单控件',
      type: '',
      items: [
        'FormInput',
        'FormTimeTicker',
        'FormInputNumber',
        'Textarea',
        'DropdownSelector',
        'Rate',
      ]
    },
    {
      title: '表格控件',
      type: '',
      items: [
        'NormalTable',
      ]
    },
    {
      title: '布局控件',
      type: '',
      items: [
        'FlexLayout'
      ]
    },
  ]
};

