import { FlatLayoutItems } from "@engine/visual-editor/data-structure";
import { WidgetType } from "@provider-app/config/widgetTypes";

/**
 * 后端需要的组件 ID 数据格式
 */
export interface PageUsedWidget {
  widgetId: string
  name?: string
  pid?: string
  type?: number
}

/**
 * 提取 widget id，用于生成权限项
 */
export const takeUsedWidgetIDs = (
  flatLayoutItems: FlatLayoutItems,
  pageDataFormRemote
): PageUsedWidget[] => {
  const { id, name } = pageDataFormRemote;
  const pageUsedWidget: PageUsedWidget[] = [];
  for (const widgetID in flatLayoutItems) {
    if (Object.prototype.hasOwnProperty.call(flatLayoutItems, widgetID)) {
      const widgetItem = flatLayoutItems[widgetID];
      // console.log('widgetItem', widgetItem);
      const _widgetType = /button/gi.test(widgetItem.widgetDef.type) ? WidgetType.button : WidgetType.other;
      pageUsedWidget.push({
        // 32 位以内的 UI_ID
        widgetId: `__${id}__${widgetID}`,
        name: widgetItem.label,
        type: _widgetType,
      });
    }
  }
  return [
    {
      widgetId: id,
      type: WidgetType.page,
      name
    },
    ...pageUsedWidget
  ];
};