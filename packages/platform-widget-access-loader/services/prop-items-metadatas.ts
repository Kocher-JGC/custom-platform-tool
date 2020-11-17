import { PropItemsCollection } from "@engine/visual-editor/data-structure";
import * as PropItemComps from "../refs-prop-item";
import { ApiMock } from "./api-mock";

/**
 */
const propItemsCollection: PropItemsCollection = {};

Object.keys(PropItemComps).forEach((compDef) => {
  const { id } = PropItemComps[compDef];
  propItemsCollection[id] = PropItemComps[compDef];
});

export const getPropItemData = ApiMock(propItemsCollection);