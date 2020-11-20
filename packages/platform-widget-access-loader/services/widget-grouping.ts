import { GroupPanelData } from "@engine/visual-editor/components/GroupPanel";
import { ApiMock } from "./api-mock";

export const widgetPanelData: GroupPanelData = {
  title: '控件类型',
  type: 'dragableItems',
  itemsGroups: [
    {
      title: '通用',
      items: [
        'FormButton',
      ]
    },
    {
      title: '表单控件',
      items: [
        'FormInput',
        'FormInputNumber',
        'Textarea',
        'DropdownSelector',
      ]
    },
    {
      title: '表格控件',
      items: [
        'NormalTable',
      ]
    },
    {
      title: '布局控件',
      items: [
        'FlexLayout'
      ]
    },
  ]
};

export const getWidgetPanelData = ApiMock(widgetPanelData);
