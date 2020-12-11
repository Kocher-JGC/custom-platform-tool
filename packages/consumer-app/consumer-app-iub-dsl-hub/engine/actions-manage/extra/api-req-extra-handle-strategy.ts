import { RefType, FuncCodeOfAPB, InterRefRelation, APBDefOfIUB, ReadDef, ReadBaseInfo } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfMetadata } from "../../runtime/types";
import { extraSetFn, genAPBId, genResolveOfIUB } from "./api-req-action-extral";
import { FindRefRelationParam } from "../../inter-meta-manage/types";

const tableFidOfCreate = Symbol('tableFidOfCreate');


const handleStrategy = {
  [tableFidOfCreate]: {
    
  }
};

interface OnceTodoRecord {
  onlyKey: string;
  needHandleFns: any[];
  /** ...其他属性扩展 */
}

interface TodoRecord {
  [str: string]: OnceTodoRecord
}

const genOnceTodo = (todoRecord: OnceTodoRecord) => {
  return (stepsIdx: number) => {
    const { onlyKey, needHandleFns } = todoRecord;  
    needHandleFns.forEach((fn) => fn((item, setKey, idx) => `$.steps[${stepsIdx}].${onlyKey}[0]`));
    return {
      resolve: genAPBId(onlyKey),
      stepsIdx
    };
  };
};

/**
 * 新增
 * 1. 获取表关系
 * 2. 存在外键关系 「储存分析结果」
 * 3. 额外转换
 */
/**
 * 1. 外键关系, 重新设置值 . [由配置人员自定义的不设置]?
 * 2. 多个id设置到一个地方
 * 3. 一个主表多个附属表
 * 
 * 额外添加外键: 情况一: 主附 一对一, 一对多, 多个附属表对一主表
 */
const tableFid = () => {
  const todoRecord: TodoRecord = {};
  const reqTransfHandleFid = (IUBCtx, { mainTable, auxTable }) => {
    const { table, set } = mainTable;
    const auxTableSet = extraSetFn(auxTable.set, 'fid');
    /** 已有主表信息 */
    if (todoRecord[table]) {
      todoRecord[table].needHandleFns.push(auxTableSet);
    } else {
      /** 没有主表信息 */
      todoRecord[table] = {
        onlyKey: table,
        needHandleFns: [
          extraSetFn(set, 'id'),
          auxTableSet,
        ]
      };
      return genOnceTodo(todoRecord[table]);
    }
  };
  return {
    reqTransfHandleFid
  };
};


const findRefRelation = async (IUBCtx: RunTimeCtxToBusiness, p: FindRefRelationParam) => {
  const { asyncDispatchOfIUBEngine } = IUBCtx;
  const ref = await asyncDispatchOfIUBEngine({
    dispatch: {
      module: DispatchModuleName.metadata,
      method: DispatchMethodNameOfMetadata.findRefRelation,
      params: [p]
    }
  });
  return Array.isArray(ref) &&ref || [];
};

/**
 * 专门处理表关系的
 * 一次调用一次实例
 */
export const extraHandleStrategy = () => {
  const interRefRelation: InterRefRelation[] = [];
  const todoList: any[] = [];
  let stepsIdx = 0;
  const { reqTransfHandleFid } = tableFid();
  
  /**
   * 生效的策略数
   */


  const itemHandle = async (IUBCtx: RunTimeCtxToBusiness, itemRunRes) => {
    const { stepsId, funcCode, set, condition, table } = itemRunRes;
    switch (funcCode) {
      case FuncCodeOfAPB.C:
        /** 添加对应的关系 */
        interRefRelation.push(...(await findRefRelation(IUBCtx, { tables: [table], refType: RefType.FK_Q })));
        break;
      case FuncCodeOfAPB.R:
        break;
      default:
        break;
    }
  };

  /**
   * 1. 可以是待处理,
   * 2. 可以是直接处理, 拼接是直接处理的
   * 3. 读取返回, 转换, 就是待处理的
   */
  const reqTransfHandle = (IUBCtx, { list, steps }) => {
    const listVal: any[] = Object.values(list);
    /** 处理每一条关系 */
    interRefRelation.forEach((refRel) => {
      /** 满足XXX条件, 使用XX策略处理 */
      /** 1. refType === fid */
      /** 生成待处理函数, 可能是同一个,可能是新的 */
      const { refId, refType, interCode, refInterCode } = refRel;
      /** 条件: 外键引用+新增+主表新增 */
      if (refType === RefType.FK_Q) {
        const mainTable = listVal.find((item) => item?.table === refInterCode && item.funcCode === FuncCodeOfAPB.C); 
        const auxTable = listVal.find((item) => item?.table === interCode && item.funcCode === FuncCodeOfAPB.C);
        /** 若无主表, 则不生效 */
        if (mainTable && auxTable) {
          /** 执行策略处理 */
          const todoFn = reqTransfHandleFid(IUBCtx, { mainTable, auxTable });
          if (todoFn) todoList.push(todoFn);
        }
      } else if (refType === RefType.QUOTE) {
        /** 连表在页面服务端转换 */
        /** 2. 连表, 补充连表信息, 可以直接处理 */
        /** 连表策略 条件: 引用 + Read + 引用的字段被使用了」 */
        /** 需要读取XXX字段 */
        /** XXX字段需要转换 */

      }
    });

    const resolves = todoList.map(todoFn => {
      const { stepsIdx: idx, resolve } = todoFn(stepsIdx);
      stepsIdx = idx;
      return resolve;
    });

    /** 统一的额外处理 */
    if (resolves.length) {
      const extraId = `todoRecord_${stepsIdx}`;
      const extraSteps = genResolveOfIUB(extraId, resolves);
      steps.unshift(extraId);
      listVal.unshift(extraSteps);
    }
    return {
      steps,
      list: listVal.reduce((res, val) => {
        res[val.stepsId] = val;
        return res;
      }, {})
    };
  };
  
  
  
  return {
    itemHandle,
    reqTransfHandle,
    resTransfHandle: '',
  };
};
