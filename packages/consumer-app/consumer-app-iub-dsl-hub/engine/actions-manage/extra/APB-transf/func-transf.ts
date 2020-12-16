import { RefType, FuncCodeOfAPB, InterRefRelation, ReadRefObjDef } from "@iub-dsl/definition";
import { pickObj } from "@iub-dsl/engine/utils";

const funcItemWrap = <T>(p: T) => ({ function: p });

const genCreateOfAPBDSL = ({
  table, set
}) => ({
  code: FuncCodeOfAPB.C,
  params: { table, set }
});

const genUpdateOfAPBDSL = ({
  table, set, condition
}) => ({
  code: FuncCodeOfAPB.U,
  params: { table, set, condition }
});

const deepGen = ({ readDef, readList }: ReadRefObjDef) => {
  const { readRef, joins } = readDef;
  const read: any = readList[readRef];
  if (joins) {
    read.joins = joins.map((item) => {
      const { joinsCond, joinsType, readDef } = item;
      const subRead = deepGen({ readDef, readList });
      return {
        [joinsType]: subRead
      };
    });
  }
  return read;
};

const genReadOfAPBDSL = ({ readDef, readList }: ReadRefObjDef) => {
  return {
    code: FuncCodeOfAPB.R,
    params: deepGen({ readList, readDef })
  };
};

const genDelOfAPBDSL = ({ table, condition }) => ({
  code: FuncCodeOfAPB.D,
  params: { table, condition }
});

const genResolveOfAPBDSL = ({ resolver }) => ({
  code: FuncCodeOfAPB.ResResolve,
  params: { resolver }
});

const genFuncItemFn = {
  [FuncCodeOfAPB.C]: genCreateOfAPBDSL, 
  [FuncCodeOfAPB.U]: genUpdateOfAPBDSL, 
  [FuncCodeOfAPB.R]: genReadOfAPBDSL, 
  [FuncCodeOfAPB.D]: genDelOfAPBDSL, 
  // [FuncCodeOfAPB.ID]: genDelOfAPBDSL, 
  // [FuncCodeOfAPB.Now]: genDelOfAPBDSL, 
  [FuncCodeOfAPB.ResResolve]: genResolveOfAPBDSL, 
  // [FuncCodeOfAPB.SysUser]: genDelOfAPBDSL, 
};

export const genFuncItemOfAPBDSL = (funcCode: FuncCodeOfAPB, item) => {
  const fn = genFuncItemFn[funcCode];
  return fn && funcItemWrap(fn(item)) || funcItemWrap({});
};
