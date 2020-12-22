import { InterRefRelation, RelationType } from "@src/page-data/types";
import { canDeep } from "../../utils";
/**
 * 注意: 拼接使用什么规则都可以, 但是要保证结构统一
 */
export const levelSplitMark = '_';


/**
 * 初始化字段引用关系迭代器的选项
 */
interface InitFieldRefRelIteratorOpts<T = Record<string, unknown>> {
  maxForwardLevel?: number;
  maxBackwardLevel?: number;
  genRefRelFields?: (refRel: InterRefRelation, info: IteratorFieldInfo<T>) => IteratorFieldDef<T>[]
  allFields: IteratorFieldDef<T>[];
}
/** 初始化迭代器的函数 */
interface InitIterationFn<T> {
  (interationParam: InterationParam<T>, pervRunCtx): unknown;
}
/** 字段迭代器每项运行的函数 */
interface ItemIterationFn<T> {
  (info: IteratorFieldInfo<T>, runCtx): unknown;
}
/** 字段迭代器结束运行的函数 */
interface EndIterationFn<T> {
  (interationParam: InterationParam<T>, pervRunCtx, runCtx): any;
}
/** 向迭代器中添加(init、item、end)处理函数的方法 */
interface AddIterationFn<T> { 
  initFn: InitIterationFn<T>;
  itemFn: ItemIterationFn<T>;
  endFn: EndIterationFn<T>;
}
/**
 * 迭代器运行的参数「上下文」
 */
interface InterationParam<T> {
  level: number;
  /** 递归时关系的类型「反向关系/正向关系」 */
  type?: 'backwardRefRel' | 'forwardRefRel';
  relationType?: RelationType;
  prevReadCode: string;
  prevFieldCode: string;
  readCode: string;
  fieldCode: string; 
  readFields: IteratorFieldDef<T>[];
  prevReadId: string;
  prevFieldId: string;
  readId: string;
  fieldId: string; 
}

/**
 * 迭代器中fieldInfo的定义
 */
export type IteratorFieldInfo<T> = ({
  infoType: 'show' | 'ref';
  interCode: string;
  fieldCode: string;
  interId: string;
  fieldId: string;
} & T);

/**
 * 迭代器中field的定义
 */
export interface IteratorFieldDef<T = Record<string, unknown>> {
  info: IteratorFieldInfo<T>;
  forwardRefRels?: InterRefRelation[];
  backwardRefRels?: InterRefRelation[];
}

const enum RealFieldType {
  ref = 'ref',
  show = 'show',
}

const genRefRelField = (refRel: InterRefRelation, info): IteratorFieldDef[] => {
  const { widgetId, colId } = info;
  const { refInterCode, refFieldCode, refInterId, refFieldId, refShowFieldId , refShowFieldCode } = refRel;
  return [
    {
      info: { 
        fieldCode: refFieldCode, interCode: refInterCode,
        fieldId: refFieldId, interId: refInterId,
        widgetId, colId: `${colId}_${refFieldId}`, 
        desc: '引用实际值', infoType: 'ref'
      },
    },
    {
      info: { 
        interCode: refInterCode, fieldCode: refShowFieldCode,
        fieldId: refShowFieldId, interId: refInterId, 
        widgetId, colId: `${colId}_${refShowFieldId}`, 
        desc: '引用显示值', infoType: 'show'
      },
    }
  ];
};

/**
 * 1. ctx, conf
 * 2. 表、字段、等级
 *  初始化、 迭代fields、 关系处理、结果返回
 * 3. 读表、字段、下级表、字段、等级
 *  关系处理、上下文、字段迭代、链接「joins、schema」
 * readFields 参照物, 其实一开始分组, 也是参照物的思想
 */

/**
 * 初始化字段引用关系迭代器
 * @description 迭代读取的字段以及递归迭代字段的关系
 * @param initOpts 初始化的参数选择
 */
export const initFieldRefRelIterator = <T = Record<string, unknown>>(initOpts: InitFieldRefRelIteratorOpts<T>) => {
  const {
    maxForwardLevel = 1, maxBackwardLevel = 1,
    allFields, genRefRelFields = genRefRelField
  } = initOpts;
  const canForwardDeep = canDeep(maxForwardLevel);
  const canBackwardDeep = canDeep(maxBackwardLevel);

  const initFns: InitIterationFn<T>[] = [];
  const itemFns: ItemIterationFn<T>[] = [];
  const endFns: EndIterationFn<T>[] = [];
  const addIterationFn = ({ initFn, itemFn, endFn }: AddIterationFn<T>) => {
    if (
      typeof initFn === 'function' && typeof itemFn === 'function' && typeof endFn === 'function'
    ) {
      initFns.push(initFn); itemFns.push(itemFn); endFns.push(endFn);
    } else {
      // err 参数有误
    }
  };
  const initRun = (iterationParam: InterationParam<T>, pervRunCtxs) => initFns.map((initFn, i) => initFn(iterationParam, pervRunCtxs[i]));
  const itemRun = (info: IteratorFieldInfo<T>, runCtxs) => itemFns.map((itemFn, i) => itemFn(info, runCtxs[i]));
  const endRun = (iterationParam: InterationParam<T>, pervRunCtxs, runCtxs) => endFns.map((endFn, i) => endFn(iterationParam, pervRunCtxs[i], runCtxs[i]));

  const iterator = (iterationParam: InterationParam<T>, pervRunCtxs) => {
    const { readFields, readCode, level } = iterationParam;
    /** 迭代器初始化 */
    const runCtxs = initRun(iterationParam, pervRunCtxs);
    
    readFields.forEach(item => {
      const { info, forwardRefRels, backwardRefRels }  = item;
      const { interCode: itemInterCode, fieldCode: itemFieldCode } = info;
      if (readCode === itemInterCode) {
        /** TODO: 临时额外配合columns的逻辑, 后续columns确定再优化 */
        if (forwardRefRels?.length || backwardRefRels?.length) {
          info.infoType = 'ref';
        } else {
          info.infoType = 'show';
        }
        /** 单项的处理 */
        itemRun(info, runCtxs);
        /** 正向关系递归 */
        if (forwardRefRels?.length && canForwardDeep(level)) {
          forwardRefRels.forEach((refRel: InterRefRelation) => {
            const { 
              interCode, interId, fieldCode, fieldId, 
              refInterCode, refFieldCode, relationType, refInterId, refFieldId,
            } = refRel;
            const subIterationParam: InterationParam<T> = { 
              level: level + 1, type: 'forwardRefRel', relationType,
              prevReadCode: interCode, prevFieldCode: fieldCode,
              prevReadId: interId, prevFieldId: fieldId,
              readCode: refInterCode, fieldCode: refFieldCode, 
              readId: refInterId, fieldId: refFieldId, 
              readFields: genRefRelFields(refRel, info) as any,
            };
            iterator(subIterationParam, runCtxs);
          });
        }
        /** 反向关系递归 */
        if (backwardRefRels?.length && canBackwardDeep(level)) {
          backwardRefRels.forEach((refRel: InterRefRelation) => {
            const { fieldCode, fieldId, interCode, interId, refInterCode, refInterId, refFieldCode, refFieldId, relationType } = refRel;
            const subIterationParam: InterationParam<T> = { 
              level: level + 1, type: 'backwardRefRel', relationType,
              prevReadId: refInterId, prevFieldId: refFieldId,
              prevReadCode: refInterCode, prevFieldCode: refFieldCode,
              readId: interId, fieldId, 
              readCode: interCode, fieldCode, 
              readFields: allFields
            };
            iterator(subIterationParam, runCtxs);
          });
        }
      }
    });

    /** 迭代器运行结束 */
    return endRun(iterationParam, pervRunCtxs, runCtxs);
  };
  return { iterator, addIterationFn };
};
