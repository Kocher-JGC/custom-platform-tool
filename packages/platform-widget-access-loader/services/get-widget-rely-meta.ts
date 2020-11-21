import { WidgetTypeMetadataCollection } from "@engine/visual-editor/data-structure";
import {
  FormInputMeta,
  FlexMeta,
  TableMeta,
  DropdownSelectorMeta,
  TextareaMeta,
  FormButtonMeta,
  FormInputNumberMeta,
  FormTimeTickerMeta,
} from "@platform-widget-access/prop-item-rely";
import { ApiMock } from "./api-mock";

const tempArr = [
  FormInputMeta,
  FlexMeta,
  TableMeta,
  DropdownSelectorMeta,
  TextareaMeta,
  FormButtonMeta,
  FormInputNumberMeta,
  FormTimeTickerMeta
];

export const widgetMetadataCollection: WidgetTypeMetadataCollection = {
};

/** 将数组转换成 collection 数据机构 */
tempArr.forEach((meta) => {
  widgetMetadataCollection[meta.widgetRef] = meta;
});

export const getWidgetMetadata = ApiMock(widgetMetadataCollection);
