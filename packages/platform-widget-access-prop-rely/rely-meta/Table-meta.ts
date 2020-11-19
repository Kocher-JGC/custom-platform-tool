import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const TableMeta = CreateWidgetPropItemRely({
  id: 'widget-id-3',
  label: '表格',
  widgetRef: 'NormalTable',
  propEditor: 'TableEditor',
  propItemsRely: {
    propItemRefs: [
      {
        propID: 'prop_datasource_selector',
        defaultValues: {

        }
      },
      // { propID: 'prop_flex_config' },
    ]
  }
});
