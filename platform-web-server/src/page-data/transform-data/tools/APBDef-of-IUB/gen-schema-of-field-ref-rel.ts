import { FoundationType, RelationType, SchemaType, ComplexType } from "@src/page-data/types";
import { splitMark } from "../../IUBDSL-mark";
import { levelSplitMark } from "./field-ref-rel-iterator";

const genSchemaItem = ({ widgetId, colId, desc, fieldId, fieldCode, interCode, interId }, prevPath) => {
  const fieldAlias = `${interCode}_${fieldCode}`;
  return {
    type: FoundationType.string,
    schemaId: `${colId}`,
    schemaKey: fieldAlias,
    schemaRef: `${prevPath}${splitMark}${fieldAlias}`,
    schemaType: SchemaType.widgetTable, widgetRef: widgetId,
    interId, fieldId, desc
  };
};

const genStructSetFnWrap = ({ fieldCode, interCode }, prevReadAlias: string) => {
  const fieldAlias = `${interCode}_${fieldCode}`;
  return {
    key: fieldAlias,
    val: `${prevReadAlias}${levelSplitMark}${fieldAlias}`
  };
};

/**
 * prevPath规则:
 * 1. forwardRefRel: prevPath + table_field + table_field
 * 2. backwardRefRel: prevPath + table + table_field {附属关系没有field}
 */
export const initGenSchemaOfFieldRefRel = (idMapDataIdx) => {
  // const idMapDataIdx = {};
  const schemaFnHandler = {
    initFn: (iterationParam, prevRunCtx) => {
      const { 
        level, prevReadCode, prevFieldCode,
        prevReadId, prevFieldId, 
        readCode, fieldCode, readId, fieldId,
        type, relationType,
      } = iterationParam;
      const { 
        prevPath, readAlais: prevReadAlias, levelShowKey: prevLevelShowKey = [],
        genSctrctItemFns: pFns, genSctrctSetFns: pSetFns,
        prevIdMap = ''
      } = prevRunCtx;

      const genSctrctItemFns = []; const genSctrctSetFns = [];
      const levelShowKey = prevLevelShowKey.slice(0);
      const isArrStruct = relationType === RelationType.MANY_TO_ONE;
      const schemaType = isArrStruct || level === 0 ? ComplexType.structArray : ComplexType.structObject;

      let schemaKey = ''; let newPrevPath = '';
      let readAlais = prevReadAlias;
      
      if (prevReadCode) {
        if (type === 'forwardRefRel') {
          schemaKey = `${prevReadCode}_${prevFieldCode}`;
          readAlais = `${prevReadAlias}${levelSplitMark}${schemaKey}`;
          newPrevPath = `${prevPath}${splitMark}${schemaKey}`;
          /** 正向关系需要干掉最后一个 */
          pFns.pop();
          pSetFns.pop();
        } else {
          schemaKey = `${readCode}`;
          readAlais = `${prevReadAlias}${levelSplitMark}${readCode}`;
          newPrevPath = `${prevPath}${splitMark}${readCode}`;
        }
        levelShowKey.push(schemaKey);
      }

      const usedPrevPath = isArrStruct ? `${newPrevPath}[#(${level}|*)]` : newPrevPath;
      /** 最终生成结果的函数 */
      const genSchemaRes = (path: string) => ({
        schemaId: `${path}_${newPrevPath}_id`, schemaRef: `${path}${newPrevPath}`,
        schemaKey, type: schemaType,
        /** 还差一步, reduce: schemaKey */
        struct: genSctrctItemFns.map(fn => fn(path))
      });
      const genSchemaSet = (path: string) => ({
        val: {
          type: schemaType,
          struct: genSctrctSetFns.map(fn => fn(path))
        },
        key: schemaKey
      });
      /** 进入新一层的递归: 加入新的 */
      pFns.push(genSchemaRes);
      pSetFns.push(genSchemaSet);
      
      return {
        genSchemaRes, genSchemaSet, levelShowKey,
        genSctrctItemFns, genSctrctSetFns,
        prevPath: usedPrevPath, readAlais,
        /** 临时: 加入的默认规则 */
        prevIdMap: `${prevReadId}:${prevFieldId}`
      };
    },
    itemFn: (info, runCtx) => {
      const { prevPath, genSctrctItemFns, genSctrctSetFns, readAlais, levelShowKey, prevIdMap } = runCtx;
      const { interCode, interId, fieldCode, fieldId, infoType } = info;
      const fieldAlias = `${interCode}_${fieldCode}`;
      const onlyKey = `${interId}:${fieldId}`;
      if (infoType === 'show') {
        idMapDataIdx[onlyKey] = levelShowKey.concat(fieldAlias);
        idMapDataIdx[prevIdMap] = levelShowKey.concat(fieldAlias);
      }
      genSctrctSetFns.push((path: string) => genStructSetFnWrap(info, path + readAlais));
      genSctrctItemFns.push((path: string) => genSchemaItem(info, path + prevPath));
    },
    endFn: (iterationParam, pervRunCtx, runCtx) => {
      return runCtx;
    },
  };

  return { schemaFnHandler };
};
