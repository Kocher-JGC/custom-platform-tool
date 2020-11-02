import {
  getWidgetMetadata, getWidgetPanelData,
  getPagePropItems, getPropItemData,
  getPropItemGroupingData,
} from "@spec/platform-widget/mock-data";

// let widgetMetaDataCollection;
// getWidgetMetadata().then((res) => {
//   widgetMetaDataCollection = res;
// });

/**
 * 加载平台组件的可渲染组件
 */
export async function loadPlatformWidgetMeta(widgetType: string) {
  return await getWidgetMetadata(widgetType);
}

/**
 * 加载平台组件的可渲染组件
 */
export async function loadWidgetPanelData() {
  return await getWidgetPanelData();
}
