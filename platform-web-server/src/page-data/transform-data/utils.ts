import { groupBy, ValueIteratee } from "lodash";

/** 生成单个equ条件 */
export const genEquCond = (exp1: string, exp2: string) =>{
  return {
    conditionControl: { and: ["0_0"] },
    conditionList: { "0_0": { operator: "equ", exp1, exp2 } }
  };
};

/**
 * 排除对象中包含keys的工具方法
 * @param obj 对象Object
 * @param keys 排除的key数组
 */
export const omitObj = (obj: { [str: string]: any }, keys: string[]) => {
  const oKeys =Object.keys(obj);
  return oKeys.reduce((res, k) => {
    if (!keys.includes(k)) {
      res[k] = obj[k];
    }
    return res;
  }, {});
};

/**
 * 提取对象中含keys的工具方法
 * @param obj 对象Object
 * @param keys 提取的key数组
 */
export const pickObj = (obj: { [str: string]: any }, keys: string[]) => 
  keys.reduce((res, k) => ({ ...res, [k]: obj[k] }), {});
