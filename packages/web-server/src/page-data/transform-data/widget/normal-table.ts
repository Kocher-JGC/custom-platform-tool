import { genFormButtonDefaltAction } from './normal-button';
import { TransfromCtx } from "../types";
import { genFormInput } from ".";
import { updateStateAction, genDefalutFlow, DEFALUT_FLOW_MARK } from "../task";
import { genExtralSchema, findTableMetadata } from "../metadata-fn";


const genTableColumns = (columns) => {
  return Object.keys(columns).filter(key => !columns[key].isPk).map(key => ({
    dataIndex: columns[key].fieldCode,
    key: columns[key].schemaId,
    title: columns[key].name,
  }));
};
/** 
 * 以下为临时生成的函数
 */

const addSearchWieght = (transfromCtx: TransfromCtx, extralSchema) => {
  const { columns, id } = extralSchema;
  const { extralDsl: { tempWeight } } = transfromCtx;
  const widget = {
    id: '',
    widgetRef: 'FormInput',
    propState: {
      field: '',
      title: ''
    }
  };
  Object.keys(columns).forEach(key => {
    const info = columns[key];
    if (info.isPk) return;
    widget.id = info.schemaId;
    widget.propState.field = info.schemaId;
    widget.propState.title = info.name;
    tempWeight.push(
      genFormInput(transfromCtx, widget)
    );
  });
};

const addSearchBuntton = (transfromCtx: TransfromCtx, extralSchema) => {
  const { columns, id } = extralSchema;
  const { extralDsl: { tempWeight, tempAction, tempFlow } } = transfromCtx;
  const weightId = `button_${id}`;
  tempWeight.push({
    id: weightId,
    widgetRef: 'NormalButton',
    title: '查询', label: '查询', text: '查询',
    type: 'componentRef',
    actions: {
      ...genFormButtonDefaltAction(weightId)
    }
  });
  const conditionList = {};
  const conditionControl = [];
  Object.keys(columns).forEach((key, i) => {
    const info = columns[key];
    if (info.isPk) return;
    conditionList[`${key}_${i}`] = {
      operator: 'like',
      exp1: `@(metadata).${id}.${info.schemaId}`,
      exp2: `@(schema).${info.schemaId}`,
    };
    conditionControl.push(`${key}_${i}`);
  });
  const updId = `${weightId}_U`;
  tempAction.push(
    {
      actionId: weightId,
      actionName: `${weightId}TableSelect`,
      actionType: 'APBDSLCURD',
      actionOptions: {
        businesscode: '34562',
        actionList: {
          apbA1: {
            type: 'TableSelect',
            table: `@(metadata).${id}`,
            condition: {
              conditionControl: {
                and: conditionControl
              },
              conditionList
            },
          }
        },
        actionStep: ['apbA1']
      },
      actionOutput: 'string', // TODO
    },
    updateStateAction(transfromCtx, updId, `@(schema).${id}`)
  );
  tempFlow.push(
    genDefalutFlow(weightId, [DEFALUT_FLOW_MARK+updId]),
    genDefalutFlow(updId),
  );
};


export const genNormanTable = (transfromCtx: TransfromCtx, { id, widgetRef, propState }) => {
  const { extralDsl, tableMetadata } = transfromCtx;
  const { optDS } = propState;
  const usedTableMetadata = findTableMetadata(tableMetadata, optDS);
  const tableExtralD = genExtralSchema(transfromCtx, usedTableMetadata, true);
  let usedColums = [];
  if (tableExtralD) {
    const { columns, id: tableId } = tableExtralD;
    usedColums = genTableColumns(columns);
    addSearchWieght(transfromCtx, { columns, id: tableId });
    addSearchBuntton(transfromCtx, { columns, id: tableId });
    extralDsl.isSearch = true;
  }
  return {
    id, widgetId: id, widgetRef,
    columns: usedColums,
    dataSource: optDS ? `@(schema).${usedTableMetadata.id}` : '',
  };
};