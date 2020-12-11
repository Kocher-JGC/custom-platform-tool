
import { DATATYPE } from '@provider-app/table-editor/constants'
;

type BasicVarItem = {title: string, code: string, varType: string, id: string}
type PageVarItem = BasicVarItem & {type: 'page'}
type SysVarItem = BasicVarItem & {type: 'system'}
type InputVarItem = BasicVarItem & {type: 'pageInput', realVal: string, alias?: string}
type WidgetVarItem = BasicVarItem & {type: 'widget'}
type VarItem = PageVarItem | SysVarItem
type GetVariableData = (param1, param2: {options, filter: string[]}) => Promise<{[key:string]: VarItem[]}>
/**
* 获取变量数据
*/
type GetPageVariable = () => PageVarItem[]
/** 获取页面变量 */
const getPageVariable: GetPageVariable = () => {
  return [
    { code: 'var.page.name', title: '页面名称', id: 'var.page.name', varType: 'string', type: 'page' },
    { code: 'var.page.code', title: '页面编码', id: 'var.page.code', varType: 'string', type: 'page' },
  ];
};

type GetSysVariable = () => SysVarItem[]
/** 获取系统变量（TODO，后续由后台接口提供支持） */
const getSystemVaraible: GetSysVariable = () => {
  return [];
};
type GetInputVariable = (param: {varRely}) => InputVarItem[]
/** 获取输入参数变量 */
const getInputVariable: GetInputVariable = ({ varRely }) => {
  if(!varRely) return [
    { title: '页面模式', type: 'pageInput', varType: 'string', realVal: 'insert', code: 'var.page.mode', id: 'var.page.0.mode' }
  ];
  const varList: InputVarItem[] = [];
  Object.keys(varRely).forEach(id=>{
    const variableItems = varRely[id];
    const { type, alias, varType, code, realVal, title } = variableItems || {};
    if(type !== 'pageInput') return;
    varList.push({
      code, type, varType, alias, id, realVal, title
    });
  });
  return varList;
};
type GetTableVariable = (param: {propState, id: string, dataSource}) => WidgetVarItem[]
const getTableVariable: GetTableVariable = ({ propState, id, dataSource }) => {
  const { ds, title, widgetCode } = propState;
  if(!ds) return [];
  /** 根据字段类型和数据类型得出 varAttr */
  const getVarattrByDatatype = (dataType, fieldType) => {
    if([DATATYPE.DICT, DATATYPE.FK, DATATYPE.QUOTE].includes(dataType)){
      return [
        { alias: '实际值', attr: 'realVal', type: fieldType },
        { alias: '显示值', attr: 'showVal', type: 'string' },
      ];
    }
    return [{ alias: '实际值', attr: 'realVal', type: fieldType }];
  };
  const getColumnsWithAttr = (dsName, dsID, column) => {
    if(!column) return [];
    const fieldTypeMap = {
      INT: 'number',
      DATE_TIME: 'dateTime',
      DATE: 'date',
      STRING: 'string',
    };
    const { name: columnName, id: columnId, fieldType, dataType } = column;
    const varAttr = getVarattrByDatatype(dataType, fieldTypeMap[fieldType]);
    return varAttr.map(item=> ({
      title: `${dsName}.${columnName}.${item.alias}`,
      id: `${dsID}.${columnId}.${item.attr}`,
      varType: item.type
    }));
  };
  /** 获取数据源所有的列 */
  const getColumnsOfDS = (dsRefIDList) => {
    return dsRefIDList.reduce((list, dsRefID)=>{
      const { columns: columnsDs, name: dsName, id: dsID } = dataSource[dsRefID];
      Object.keys(columnsDs).forEach((columnID) => {
        list = [...list, ...getColumnsWithAttr(dsName, dsID, columnsDs[columnID])];
      });
      return list;
    }, []);
  };
  // TODO DS
  const columns = getColumnsOfDS([ds]);
  const result: WidgetVarItem[] = [];
  [
    { label: '选中行', value: 'selectedRow', type: 'Array' },
    { label: '当前行', value: 'currentRow', type: '' },
  ].forEach(item=>{
    columns.forEach(columnItem=>{
      result.push({
        title: `${title}.${item.label}.${columnItem.title}`,
        id: `${id}.${item.value}.${columnItem.id}`,
        varType: `${columnItem.varType}${item.type}`,
        type: 'widget',
        code: `${widgetCode}.${item.value}.${columnItem.id}`
      });});
  });
  return result;
};

type GetFormVariable = (param: {propState, id: string, varAttr }) => WidgetVarItem[]
const getFormVariable: GetFormVariable = ({ propState, varAttr, id }) => {
// TODO: 这里取了特定的值，后续需要改进
  const { widgetCode, title } = propState;
  const list: WidgetVarItem[] = [];
  /** 控件对应变量 */
  if(!Array.isArray(varAttr)){
    return [];  
  }
  varAttr.forEach((varItem) => {
    const { alias, attr, type: varType } = varItem;
    const code = `${widgetCode}.${attr}`;
    list.push({
      code, varType, type: 'widget',
      title: `${title}.${alias}`,
      id: `${id}.${attr}`,
    });
  });
  return list;
};
/** 获取控件变量 */
type GetWidgetVariable = (param: {varRely, flatLayoutItems, dataSource }) => WidgetVarItem[]
const getWidgetVariable: GetWidgetVariable = ({ varRely, flatLayoutItems, dataSource }) => {
  let varList: WidgetVarItem[] = [];
  if(!varRely) return [];
  Object.keys(varRely).forEach(varID=>{
    const variableItems = varRely[varID];
    const { type, varAttr, widgetRef } = variableItems;
    /** 只检索控件类型变量 */
    if(type !== 'widget' || !widgetRef) return ;
    /** 获取对应控件数据 */
    const widgetEntity = flatLayoutItems[widgetRef];
    if(!widgetEntity) return;
    const { propState, id, wGroupType } = widgetEntity;
    if (!propState) return;
    if(wGroupType === 'dataDisplay'){
      const tableVar = getTableVariable({ propState, id, dataSource });
      varList = [...varList, ...tableVar];
    }
    if(wGroupType === 'formController'){
      const formVar = getFormVariable({ propState, varAttr, id });
      varList = [...varList, ...formVar];
    }
  });
  return varList;
};
/** 获取自定义变量 */
const getCustomedVariable = () => {
  return [];
};
export const getVariableDataTool: GetVariableData = async (ctx, { options, filter = [] }) => {
  const varRely = options ? options.varRely : ctx?.pageMetadata.varRely;
  const flatLayoutItems = options ? options.flatLayoutItems : ctx?.flatLayoutItems;
  const { dataSource } = ctx?.pageMetadata;
  const getVariable = {
    customed: getCustomedVariable,
    system: getSystemVaraible,
    widget: getWidgetVariable,
    page: getPageVariable,
    pageInput: getInputVariable
  };
  const result = {};
  Object.keys(getVariable).forEach(async key=>{
    if(filter.includes(key)) return;
    if(typeof getVariable[key] !== 'function') return;
    const resultTmpl = await getVariable[key]({ varRely, flatLayoutItems, dataSource });
    Object.assign(result, { [key]: resultTmpl });
  });
  return result;    
};