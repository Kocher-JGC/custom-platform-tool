/**
* 获取变量数据
*/

/** 获取页面变量 */
const getPageVariable = () => {
  return [
    { code: 'var.page.name', title: '页面名称', id: 'var.page.name', varType: 'string', type: 'page' },
    { code: 'var.page.code', title: '页面编码', id: 'var.page.code', varType: 'string', type: 'page' },
  ];
};

/** 获取系统变量（TODO，后续由后台接口提供支持） */
const getSystemVaraible = () => {
  return [];
};
/** 获取输入参数变量 */
const getInputVariable = ({ varRely }) => {
  if(!varRely) return [
    { title: '页面模式', type: 'pageInput', varType: 'string', realVal: 'insert', code: 'var.page.mode', id: 'var.page.0.mode' }
  ];
  const varList = [];
  for(const id in varRely ){
    if (!Object.prototype.hasOwnProperty.call(varRely, id)) continue;
    const variableItems = varRely[id];
    const { type, alias, varType, code, realVal, title } = variableItems || {};
    if(type !== 'pageInput') continue;
    varList.push({
      code, type, varType, alias, id, realVal, title
    });
  }
  return varList;
};

const getTableVariable = ({ propState, id, type, dataSource }) => {
  const { ds, title, widgetCode } = propState;
  if(!ds) return [];
  const getColumns = (dsRefIDList) => {
    const fieldTypeMap = {
      INT: 'number',
      DATE_TIME: 'dateTime',
      DATE: 'date',
      STRING: 'string',
    };
    return dsRefIDList.reduce((list, dsRefID)=>{
      const { columns, name: dsName, id: dsID } = dataSource[dsRefID];
      for(const columnID in columns){
        const { name: columnName, id, fieldType } = columns[columnID] || {};
        list.push({
          title: `${dsName}.${columnName}`,
          id: `${dsID}.${id}`,
          varType: fieldTypeMap[fieldType]
        });
      }
      return list;
    }, []);
  };
  // TODO DS
  const columns = getColumns([ds]);
  const result = [];
  [
    { label: '选中行', value: 'selectedRow', type: 'Array' },
    { label: '当前行', value: 'currentRow', type: '' },
  ].forEach(item=>{
    columns.forEach(columnItem=>{
      result.push({
        title: `${title}.${item.label}.${columnItem.title}`,
        id: `${id}.${item.value}.${columnItem.id}`,
        varType: `${columnItem.varType}${item.type}`,
        type,
        code: `${widgetCode}.${item.value}.${columnItem.id}`
      });});
  });
  console.log(result);
  return result;
};

const getFormVariable = ({ propState, varAttr, id, type }) => {
// TODO: 这里取了特定的值，后续需要改进
  const { widgetCode, title } = propState;
  const list = [];
  /** 控件对应变量 */
  Array.isArray(varAttr) && varAttr.forEach((varItem) => {
    const { alias, attr, type: varType } = varItem;
    const code = `${widgetCode}.${attr}`;
    list.push({
      code, varType, type,
      title: `${title}.${alias}`,
      id: `${id}.${attr}`,
    });
  });
  return list;
};
/** 获取控件变量 */
const getWidgetVariable = ({ varRely, flatLayoutItems, dataSource }) => {
  let varList = [];
  if(!varRely) return [];
  for(const varID in varRely ){
    if (!Object.prototype.hasOwnProperty.call(varRely, varID)) continue;
    const variableItems = varRely[varID];
    const { type, varAttr, widgetRef } = variableItems;
    /** 只检索控件类型变量 */
    if(type !== 'widget' || !widgetRef) continue;
    /** 获取对应控件数据 */
    const widgetEntity = flatLayoutItems[widgetRef];
    if(!widgetEntity) continue;
    const { propState, id, wGroupType } = widgetEntity;
    if (!propState) continue;
    if(wGroupType === 'dataDisplay'){
      const tableVar = getTableVariable({ propState, varAttr, id, type, dataSource });
      varList = [...varList, ...tableVar];
    }
    if(wGroupType === 'formController'){
      const formVar = getFormVariable({ propState, varAttr, id, type });
      varList = [...varList, ...formVar];
    }
  }
  return varList;
};
/** 获取自定义变量 */
const getCustomedVariable = () => {
  return [];
};
export const getVariableData = async function (filter: string[] = [], options) {
  const varRely = options ? options.varRely : this.props.pageMetadata.varRely;
  const flatLayoutItems = options ? options.flatLayoutItems : this.props.flatLayoutItems;
  const dataSource = this.props.pageMetadata.dataSource;
  const getVariable = {
    customed: getCustomedVariable,
    system: getSystemVaraible,
    widget: getWidgetVariable,
    page: getPageVariable,
    pageInput: getInputVariable
  };
  const result = {};
  for(const key in getVariable){
    if(filter.includes(key)) continue;
    if(typeof getVariable[key] !== 'function') continue;
    const resultTmpl = await getVariable[key]({ varRely, flatLayoutItems, dataSource });
    Object.assign(result, { [key]: resultTmpl });
  }
  return result;    
};