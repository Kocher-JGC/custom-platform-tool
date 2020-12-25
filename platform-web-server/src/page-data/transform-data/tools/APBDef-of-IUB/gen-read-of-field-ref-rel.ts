import { splitMark } from "../../IUBDSL-mark";
import { levelSplitMark } from "./field-ref-rel-iterator";

const genJoinsDef = ({ readDef,  left, right }) => {
  return {
    readDef,
    joinsType: 'leftJoin',
    /** 2. 连表条件 */
    joinsCond: {
      and: [
        { equ: { left, right } }
      ]
    }
  };
};

const genReadField = ({ table, field, readAlais }) => {
  return {
    field, table: readAlais,
    alias: `${readAlais}${levelSplitMark}${table}_${field}`
  };
};

const genRead = (table: string, alias: string, extral?) => ({ table, alias, ...extral });
const initReadDef = (readRef: string) => ({ readRef, joins: [] });


/**
 * readAlais规则:
 * 1. forwardRefRel: prevReadAlias + tableCode_fieldCode + tableCode_fieldCode
 * 2. backwardRefRel: prevReadAlias + tableCode + tableCode_fieldCode {附属关系没有field}
 */
export const initGenReadOfFieldRefRel = () => {
  const allReadFields = [];
  const allReadList = {};
  const allReadAlias = [];

  const readRunInit = (iterationParam, prevRunCtx) => {
    const { prevFieldCode, readCode, prevReadCode, fieldCode, type, readFields: handleFields } = iterationParam;
    const { readAlais: prevReadAlias, readDef: prevReadDef, readFields: prevReadFields = [] } = prevRunCtx;
    const { joins: prevJoins } = prevReadDef || {};
    
    const readFields = [];
    /** 生成本级读的别名 */
    let readAlais = prevReadAlias;
    if (prevFieldCode) {
      if (type === 'forwardRefRel') {
        // readAlais = `${prevReadAlias}${'|'}${prevFieldCode}_${readCode}`;
        readAlais = `${prevReadAlias}${levelSplitMark}${prevReadCode}_${prevFieldCode}`;
        prevReadFields.pop();
      } else { // prevReadAlias, 应该切去上级才对
        readAlais = `${prevReadAlias}${levelSplitMark}${readCode}`;
        readFields.push(genReadField({ field: 'fid', readAlais, table: readCode }));
        // readAlais = `${prevReadAlias}_${readCode}`;
      }
      prevReadFields.push({ table: readAlais });
    }
    allReadAlias.push(readAlais);

    /** 本级读的定义 */
    // const read = prevFieldCode ? genRead(readCode, readAlais) : genRead(readCode, readAlais, { fields: allReadFields }) ;
    const read = genRead(readCode, readAlais, { fields: readFields }) ;
    const readDef = initReadDef(read.alias);
    allReadList[readDef.readRef] = read;

    /** 处理递归的信息, joins */
    if (prevFieldCode && Array.isArray(prevJoins)) {
      const jonsDef = genJoinsDef({ 
        readDef,
        left: {
          table: prevReadAlias,
          field: prevFieldCode,
        },
        right: {
          table: readAlais,
          field: `${readAlais}${levelSplitMark}${readCode}_${fieldCode}` 
          // field: fieldCode
        }
      });
      prevJoins.push(jonsDef);
    }

    /** read运行的上下文 */
    return {
      readDef, read, readAlais, readFields
    };
  };
  const readItemHandler = (info, runCtx) => {
    const { readAlais, readFields } = runCtx;
    const { 
      interId, fieldId,
      interCode, fieldCode,
      // desc, colId, // widgetId,
    } = info;
    /** 当前表的字段alias */
    const readField = genReadField({ readAlais, table: interCode, field: fieldCode }); 
    readFields.push(readField);
    allReadFields.push(readField);
  };
  const readRunEnd = (iterationParam, pervRunCtx, runCtx) => {
    return runCtx.readDef;
  };

  return {
    readList: allReadList,
    readFields: allReadFields,
    readAlias: allReadAlias,
    iterationFn: {
      initFn: readRunInit, 
      itemFn: readItemHandler,
      endFn: readRunEnd
    }
  };
};
