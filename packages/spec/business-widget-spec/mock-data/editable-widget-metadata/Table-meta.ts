import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";
import { TableEditor } from "../../CustomEditor/TableEditor";

export const TableMeta: EditableWidgetMeta = {
  id: 'widget-id-3',
  label: '表格',
  widgetRef: 'NormalTable',
  propEditor: TableEditor,
  propItemsRely: {
    propItemRefs: [
      // { propID: 'prop_style_title_color' },
      // { propID: 'prop_flex_config' },
    ]
  }
};
