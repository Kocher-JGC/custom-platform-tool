import { WidgetTypeMetadataCollection } from "@engine/visual-editor/data-structure";
import { ApiMock } from "../api-mock";
import { FormInputMeta } from "./FormInput-meta";
import { FlexMeta } from "./Flex-meta";
import { TableMeta } from "./Table-meta";
import { DropdownSelectorMeta } from "./DropdownSelector-meta";
import { TextareaMeta } from "./Textarea-meta";
import { FormButtonMeta } from "./FormButton-meta";

const tempArr = [
  FormInputMeta,
  FlexMeta,
  TableMeta,
  DropdownSelectorMeta,
  TextareaMeta,
  FormButtonMeta,
];

export const widgetMetadataCollection: WidgetTypeMetadataCollection = {
};

/** 将数组转换成 collection 数据机构 */
tempArr.forEach((meta) => {
  widgetMetadataCollection[meta.widgetRef] = meta;
});

export const getWidgetMetadata = ApiMock(widgetMetadataCollection);
