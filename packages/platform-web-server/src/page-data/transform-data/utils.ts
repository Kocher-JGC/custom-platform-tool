/** 生成单个equ条件 */
export const genEquCond = (exp1: string, exp2: string) =>{
  return {
    conditionControl: { and: ["0_0"] },
    conditionList: { "0_0": { operator: "equ", exp1, exp2 } }
  };
};

export const omitObj = (obj: { [str: string]: any }, keys: string[]) => {
  const oKeys =Object.keys(obj);
  return oKeys.reduce((res, k) => {
    if (!keys.includes(k)) {
      res[k] = obj[k];
    }
    return res;
  }, {});
};

export const pickObj = (obj: { [str: string]: any }, keys: string[]) => 
  keys.reduce((res, k) => ({ ...res, [k]: obj[k] }), {});