import React from 'react';
import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import { LightFilter, ProFormDatePicker } from '@ant-design/pro-form';
import './style.scss';
export type QueryStyleAsForm = {queryStyle: 'asForm'}
export type QueryStyleInToolbar = {queryStyle: 'inToolbar'}
export type QueryTypeTypical = {typical: {maxNum?:number}&QueryStyleInToolbar|QueryStyleAsForm}
export type QueryTypeSpecial = {special: QueryStyleInToolbar|QueryStyleAsForm}
export interface GeneralTableCompProps {
  columns: any[]
  dataSource: any[]
  title: string
  titleAlign: 'left'|'right'|'center'
  defaultPageSize: number
  showOrderColumn: boolean
  wordWrap: boolean
  queryType: QueryTypeTypical&QueryTypeSpecial&{keyword: null}
  rowCheckType: 'no'|'single'|'multi'
  checkedRowsStyle: 'checkCell'|'activeRow'|'checkCellAndactiveRow'
}

export class GeneralTableComp extends React.Component<GeneralTableCompProps> {
  state = {}
  
  /** 拼接展示列 */
  getColumns = ({ columns, wordWrap, showOrderColumn }) => {
    let result = (columns || [])
      /** 配置人员可以配置不显示字段 */
      .filter(item=>item.show)
      .map(item=>({
        dataIndex: `${item.id}`,
        ...item
      }));
    /** 单元格内是否支持换行 */
    const getEllipsis = () => {
      if(wordWrap) return {};
      return { ellipsis: true };
    };
    const getClassName = () => {
      /** 单元格换行 */
      const cNForEllipsis = () => {
        if(wordWrap) return 'break-all';
      };
      return [cNForEllipsis()].join(' ');
    };
    const ellipsis = getEllipsis();
    const className = getClassName();
    result = (result || []).map(item=>({ className, ...ellipsis, ...item }));
    /** 是否显示排序号 */
    if(showOrderColumn){
      result = [
        { dataIndex: 'order', key: 'key', title: '序号', align: 'center', width: 20, search: false, render:(_t,_r,_i)=>_i+1 },
        ...result
      ];
    }
    return result;
  };
  /** 根据查询方式，决定标题和搜索框的位置 */
  getPropsForSearch = ({ queryType, title, columns }) => {
    const getSearch = () => {
      const { typical: { queryStyle } } = queryType || { typical:{} };
      return queryStyle === 'asForm' ? {} : { search: false };
    };
    const getToolbarOrTitle = () => {
      const { typical: { queryStyle, maxNum } } = queryType || { typical:{} };
      return queryStyle !== 'asForm' && (columns || []).length > 0 ?  {
        toolbar: {
          title,
          filter: (
            <LightFilter>
              {(columns || []).slice(0,maxNum).map(item=>(
                <ProFormDatePicker label={item.name} key={item.id}/>
              ))}
            </LightFilter>
          )
        }
      } : { headerTitle: title };
    };
    return { ...getToolbarOrTitle(), ...getSearch() };
  };
  /** 获取表格选中方式 */
  getRowSelection = ({ rowCheckType, checkedRowsStyle })=>{
    const result = { columnWidth: 20 };
    if(rowCheckType === 'single') {
      result.type = 'radio';
    }
    if(rowCheckType === 'multi'){
      result.type = 'checkbox';
    }
    if(checkedRowsStyle === 'activeRow'){
      result.columnWidth = 0;
    }
    return rowCheckType === 'no' ? {} : { rowSelection: result };
    //TODO 应用端的交互效果
  };
  getClassName = ({ titleAlign, queryType, rowCheckType, checkedRowsStyle })=>{
    /** 标题位置：只在 toolbar 只有标题时才能起作用 */
    const getCNForTitleAlign = ()=>{
      const hasInToolbar = Object.values(queryType||[]).some(item=>item?.queryStyle === 'inToolbar');
      return hasInToolbar ? '' : `title-align-${titleAlign}`;
    };
    /** 不以勾选框表现选中行 */
    const getCNForRowSelection = () => {
      const noCheckCell = rowCheckType === 'no' || checkedRowsStyle === 'activeRow';
      return noCheckCell ?  'no-row-select-cell' : '';
    };
    return [getCNForTitleAlign(), getCNForRowSelection()].join(' ');
  };
  /** 分页 */
  getPagination = ({ defaultPageSize, pageSize = defaultPageSize })=>{
    return !defaultPageSize ? false : { 
      defaultPageSize,
      pageSize,
      pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
      //TODO total, onChange 等的实现
    };
  };
  render = () => {
    const { 
      /** 配置的列 */
      columns = [], 
      /** 是否先是序号列 */
      showOrderColumn, 
      /** 配置的数据源 */
      dataSource = [], 
      /** 表格标题 */
      title, 
      /** 表格标题位置 */
      titleAlign, 
      /** 默认每页显示行数 */
      defaultPageSize, 
      /** 查询方式 */
      queryType, 
      /** 单元格换行 */
      wordWrap,
      /** 选中方式 */
      rowCheckType,
      /** 选中形式 */
      checkedRowsStyle,
      ...other } = this.props || {};
    const rowSelection = this.getRowSelection({ rowCheckType, checkedRowsStyle });
    const columnsWithOrder = this.getColumns({ columns, showOrderColumn, wordWrap });
    const decorativeProps = this.getPropsForSearch({ title, queryType, columns });
    const className = this.getClassName({ titleAlign, queryType, rowCheckType, checkedRowsStyle });
    const pagination = this.getPagination({ defaultPageSize });
    return (
      <ConfigProvider locale={zhCN}>
        <ProTable 
          className={className}
          headerTitle={title}
          columns={columnsWithOrder || []} 
          dataSource={dataSource} 
          pagination={pagination}
          options={false}
          {...rowSelection}
          {...other}
          {...decorativeProps}
        />
      </ConfigProvider>
    );
  }
}
