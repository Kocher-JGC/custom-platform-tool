/** 生成单个equ条件 */
export const genEquCond = (exp1: string, exp2: string) =>{
  return {
    conditionControl: { and: ["0_0"] },
    conditionList: { "0_0": { operator: "equ", exp1, exp2 } }
  };
};