import { FlatLayoutItems } from "@engine/visual-editor/data-structure";
import { WidgetTypes } from "@provider-app/config/widgetTypes";

/**
 * 后端需要的组件 ID 数据格式
 */
export interface PageUsedWidget {
  widgetId: string
  name?: string
  pid?: string
  /** 对应前端的 WidgetTypes */
  type?: number
}

/**
 * 提取 widget id，用于生成权限项
 */
export const takeUsedWidgetIDs = (
  flatLayoutItems: FlatLayoutItems,
  pageDataFormRemote
): PageUsedWidget[] => {
  const { id: pageID, name } = pageDataFormRemote;
  const pageUsedWidget: PageUsedWidget[] = [];
  for (const widgetID in flatLayoutItems) {
    if (Object.prototype.hasOwnProperty.call(flatLayoutItems, widgetID)) {
      const widgetItem = flatLayoutItems[widgetID];
      // console.log('widgetItem', widgetItem);
      const _widgetType = /button/gi.test(widgetItem.widgetRef) ? WidgetTypes.button : WidgetTypes.other;
      pageUsedWidget.push({
        // 32 位以内的 UI_ID
        widgetId: `__${pageID}__${widgetID}`,
        name: widgetItem.label,
        pid: pageID,
        type: _widgetType,
      });
    }
  }
  return [
    {
      widgetId: pageID,
      type: WidgetTypes.page,
      name
    },
    ...pageUsedWidget
  ];
};

export const genBusinessCode = (
  flatLayoutItems: FlatLayoutItems,
  pageDataFormRemote
) => {
  const { id: pageID, name } = pageDataFormRemote;
  const businessCodes: PageUsedWidget[] = [];
  for (const widgetID in flatLayoutItems) {
    if (Object.prototype.hasOwnProperty.call(flatLayoutItems, widgetID)) {
      const widgetItem = flatLayoutItems[widgetID];
      // console.log('widgetItem', widgetItem);
      const isButton = /button/gi.test(widgetItem.widgetRef);
      if (isButton) {
        businessCodes.push({
          // 32 位以内的 UI_ID
          widgetId: `__${pageID}__${widgetID}`,
          name: widgetItem.label,
          code: `__${pageID}__${widgetID}`
        });
      }
    }
  }
  return businessCodes;
  // return [
  //   {
  //     widgetId: `__${pageID}__`,
  //     name,
  //     code: `queryPerson`
  //   }
  // ];
};
