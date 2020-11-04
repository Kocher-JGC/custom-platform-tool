/**
 * 1. metadata
 * 2. PK
 * 3. colKey 「index」 /rowKey 「dataIndex」
 * 4. colData / rowData
 * 5. dataSource
 * 6. gridData
 * 7. recordTotal /pageSize/currentPage
 */

/** 有关联组件和事件的意图 */
export const antTableRowClick = (
  // 留坑: 第一次渲染传入的参数「配置」
  renderCompInfo, // 临时
) => ({
  gridData, rowData, colKey, dataSource,
  // 临时
  pageStatus
}) => {
  const {
    originConf: { dataSource: schemasPatch }, compTag, mark: compMark, widgetId
  } = renderCompInfo;
  return {
    type: 'antTableRowClick',
    payload: {
      pageStatus,
      table: {
        gridData, rowData, colKey, dataSource
      },
      schemasPatch,
      compTag,
      compMark,
      widgetId
    }
  };
};
