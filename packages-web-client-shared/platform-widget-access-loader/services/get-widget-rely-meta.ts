import { WidgetTypeMetadataCollection } from "@engine/visual-editor/data-structure";
import * as MetaCollection from "@platform-widget-access/register/rely-meta";
import { ApiMock } from "./api-mock";

/**
 * 创建组件集合
 */
const createWidgetMetaColl = () => {
  const res = {};
  /** 将数组转换成 collection 数据机构 */
  Object.keys(MetaCollection).forEach((metaKey) => {
    const meta = MetaCollection[metaKey];
    res[meta.widgetRef] = meta;
  });
  return res;
};

export const widgetMetadataCollection: WidgetTypeMetadataCollection = createWidgetMetaColl();

export const getWidgetMetadata = ApiMock(widgetMetadataCollection);
