import { EditableWidgetMeta } from "@engine/visual-editor/data-structure";

export const TableMeta: EditableWidgetMeta = {
  id: 'widget-id-3',
  label: '表格',
  widgetRef: 'NormalTable',
  propEditor: 'TableEditor',
  propItemsRely: {
    propItemRefs: [
      // { propID: 'PropLabelColor' },
      // { propID: 'prop_flex_config' },
    ]
  }
};
