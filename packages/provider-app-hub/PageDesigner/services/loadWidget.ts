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
export async function loadPlatformWidgetMeta(metaID: string) {
  return await getWidgetMetadata(metaID);
}

/**
 * 加载组件面板数据
 */
export async function loadWidgetPanelData() {
  return await getWidgetPanelData();
}

/**
 * 加载属性项
 */
export async function loadPropItemData(metaID = '') {
  return await getPropItemData(metaID);
}

/**
 * 加载页面属性项
 */
export async function loadPagePropItems(metaID: string) {
  return await getPagePropItems(metaID);
}

/**
 * 加载页面属性项
 */
export async function loadPropItemGroupingData() {
  return await getPropItemGroupingData();
}
