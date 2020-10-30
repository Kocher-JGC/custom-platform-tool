export const antTableRowClick = (
  // 留坑: 第一次渲染传入的参数「配置」
) => (
  value: string, record: any, index: number, // originNode?: React.ReactNode
) => ({
  type: 'antTableRowClick',
  payload: { record, index }
});
