import {
  getWidgetMetadata, getWidgetPanelData,
  getPagePropItems, getPropItemData,
  getPropItemGroupingData,
} from "@spec/platform-widget/mock-data";
import { getPageDetailService } from "@provider-app/services";
// import { getDataSourcePanelConfig } from "../components/DataSource";
import { takeDatasources } from "./datasource";

/**
 * 获取页面详细数据
 * @param pageID 页面 id
 */
export const getPageContentWithDatasource = async (pageID) => {
  const pageDataRes = await getPageDetailService(pageID);
  const { dataSources, pageContent } = pageDataRes;
  const interDatasources = await takeDatasources(dataSources);
  return {
    pageDataRes,
    pageContent,
    interDatasources
  };
};
/**
 * 获取前端动态资源
 */
export const getFEDynamicData = async () => {
  const [
    widgetPanelData,
    pagePropsData,
    propItemData,
    propItemGroupingData,
  ] = await Promise.all([
    // getWidgetMetadata(),
    getWidgetPanelData(),
    getPagePropItems(),
    getPropItemData(),
    getPropItemGroupingData(),
  ]);

  const FEDynamicData = {
    widgetPanelData,
    propItemGroupingData,
    propItemData,
    pagePropsData,
  };

  console.log('FEDynamicData :>> ', FEDynamicData);

  return FEDynamicData;
};
