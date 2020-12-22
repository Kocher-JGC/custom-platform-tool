import { genTableRead } from "./table-read";
import { interMetaMark } from '../IUBDSL-mark';
import { TransfromCtx } from "../../types";
import { genDefaultTableDelBtn } from './normal-button';

const omitColKey = ['colDataType', 'fieldSize', 'fieldType'];

/** 统计函数 */
const enum CountFn {
  count = 'count()',
  sum = 'sum()',
  avg = 'avg()',
  max = 'max()',
  min = 'min()',
}

/**
 * 1. 生成schema
 * 2. 生成查询/组装
 * 3. 关系连表
  "fields": [
    {
      "table": "a", // 处理多表字段名冲突；非必填
      "field": "name",
      "alias": "username"
    },
  ]
*/
/**
 * 请求:
 * 1. C、U: set、target、condition
 * 2. R: target、queryParam
 */
/**
 * 1. 确保wideget的数据模型 「值、数据源、分页、选择、等属性」(schema)
 * 2. 确保与接口元数据的引用关系
 * 3. 确保默认事件/动作的正确
 */

export const genNormanTable = (transfromCtx: TransfromCtx, widgetProps) => {
  const { pkSchemaRef } = transfromCtx;
  const { id, widgetRef, propState } = widgetProps;
  let { ds } = propState;
  ds = Array.isArray(ds) ? ds : [ds.replace('ds.', '')];
  propState.ds = ds;
  const delBtn = genDefaultTableDelBtn(transfromCtx, { table: interMetaMark + ds[0], condition: pkSchemaRef[0] });
  const { eventHandlers } = genTableRead(transfromCtx, widgetProps);
  
  return [
    delBtn,
    {
      widgetId: id, widgetRef,
      propState,
      eventHandlers
      // dataSource: optDS ? `@(schema).${usedTableMetadata.id}` : '',
    }
  ];
};
