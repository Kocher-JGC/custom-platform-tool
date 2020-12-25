import { PageFieldsDef } from "../../../types";
import { splitMark, runCtxPayloadMark } from "../../IUBDSL-mark";
import { levelSplitMark } from "./field-ref-rel-iterator";

const genSchemaSetItem = ({ table, field, readAlais, schemaRef }) => {
  return {
    key: schemaRef,
    val: `${runCtxPayloadMark}[#(0|0)]${splitMark}${readAlais}${levelSplitMark}${table}_${field}`
  };
};

/**
 * readAlais规则:
 * 1. forwardRefRel: prevReadAlias + tableCode_fieldCode + tableCode_fieldCode
 * 2. backwardRefRel: prevReadAlias + tableCode + tableCode_fieldCode {附属关系没有field}
 */
export const initGenReadSchemaSetOfRefRel = () => {
  const allReadAlias = [];
  const schemaSetStruct = [];
  
  const readRunInit = (iterationParam, prevRunCtx) => {
    const { prevFieldCode, readCode, prevReadCode, fieldCode, type } = iterationParam;
    const { readAlais: prevReadAlias } = prevRunCtx;
    /** 生成本级读的别名 */
    let readAlais = prevReadAlias;
    if (prevFieldCode) {
      if (type === 'forwardRefRel') {
        readAlais = `${prevReadAlias}${levelSplitMark}${prevReadCode}_${prevFieldCode}`;
      } else { // prevReadAlias, 应该切去上级才对
        readAlais = `${prevReadAlias}${levelSplitMark}${readCode}`;
      }
    }
    allReadAlias.push(readAlais);
    /** 本级读的定义 */

    /** read运行的上下文 */
    return {
      readAlais
    };
  };
  const readItemHandler = (info, runCtx) => {
    const { readAlais } = runCtx;
    const { 
      interId, fieldId,
      interCode, fieldCode,
      schemaSet, genSchemaSetItem: gen
    } = info;
    if (schemaSet) {
      let schemaSetItem;
      if (typeof schemaSet === 'string') {
        schemaSetItem = genSchemaSetItem({ readAlais, table: interCode, field: fieldCode, schemaRef: schemaSet }); 
      } else {
        schemaSetItem = gen(readAlais); 
      }
      schemaSetStruct.push(schemaSetItem);
    }
    /** 当前表的字段alias */
  };
  const readRunEnd = (iterationParam, pervRunCtx, runCtx) => {
    return runCtx;
  };

  return {
    schemaSetStruct,
    iterationFn: {
      initFn: readRunInit, 
      itemFn: readItemHandler,
      endFn: readRunEnd
    }
  };
};
