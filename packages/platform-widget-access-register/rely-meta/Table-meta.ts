import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const TableMeta = CreateWidgetPropItemRely({
  id: 'widget-id-3',
  label: '表格',
  widgetRef: 'NormalTable',
  wGroupType: 'dataDisplay',
  // propEditor: 'TableEditor',
  propItemsRely: {
    propItemRefs: [
      {
        propID: 'prop_table_ds_helper',
        defaultValues: {

        }
      },
      {
        propID: 'prop_title_value',
        editAttr: ['title'],
        defaultValues: {
          title: '表格'
        },
      },
      // { propID: 'prop_flex_config' },
    ]
  }
});
