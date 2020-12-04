import { PropItemsCollection } from "@platform-widget-access/spec";
import * as PropItemComps from "@platform-widget-access/register/refs-prop-item";
import { ApiMock } from "./api-mock";

/**
 * 创建属性项集合
 */
const createPropItemColl = () => {
  const res = {};
  /** 将数组转换成 collection 数据机构 */
  Object.keys(PropItemComps).forEach((compDef) => {
    const { id } = PropItemComps[compDef];
    res[id] = PropItemComps[compDef];
  });
  return res;
};

/**
 */
const propItemsCollection: PropItemsCollection = createPropItemColl();

export const getPropItemData = ApiMock(propItemsCollection);
