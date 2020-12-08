import { CreateWidgetPropItemRely } from "@platform-widget-access/spec";

export const TableMeta = CreateWidgetPropItemRely({
  label: '表格',
  widgetRef: 'NormalTable',
  wGroupType: 'dataDisplay',
  eventAttr: [
    { alias: '查询', type: 'onQuery' },
    { alias: '选择行', type: 'onRowCheck' },
    { alias: '双击行', type: 'onRowDbClick' },
    { alias: '单击行', type: 'onRowClick' },
    { alias: '双击单元格', type: 'onCellDbClick' },
    { alias: '单击单元格', type: 'onCellClick' },
  ],
  // propEditor: 'TableEditor',
  propItemsRely: {
    propItemRefs: [
      { propID: 'prop_widget_coding', editAttr: ['widgetCode'] },
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
      {
        propID: 'prop_title_align',
        editAttr: ['titleAlign'],
        defaultValues: {
          titleAlign: 'left'
        },
      },
      {
        propID: 'prop_page_size',
        editAttr: ['pageSize'],
        defaultValues: {
          pageSize: 10
        },
      },
      {
        propID: 'prop_show_order_column',
        editAttr: ['showOrderColumn'],
        defaultValues: {
          showOrderColumn: false
        },
      },
      {
        propID: 'prop_word_wrap',
        editAttr: ['wordWrap'],
        defaultValues: {
          wordWrap: false
        },
      }, 
      {
        propID: 'prop_check_row',
        editAttr: ['rowCheckType', 'checkedRowsStyle'],
        defaultValues: {
          rowCheckType: 'no'
        }
      },
      { propID: 'prop_action_config', editAttr: ['eventRef'] },
      { 
        propID: 'prop_query_type', 
        editAttr: ['queryType'], 
        defaultValues: {
          queryType: {
            typical: 'asForm'
          }
        }
      },
      // { propID: 'prop_flex_config' },
    ]
  }
});
