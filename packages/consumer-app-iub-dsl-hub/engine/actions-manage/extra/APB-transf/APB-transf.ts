import { genFuncItemOfAPBDSL } from "./func-transf";

export const APBTransf = ({ list, steps,  }) => {
  const stepsVal = steps.map(stepId => {
    const item = list[stepId];
    if (item) {
      const { funcCode } = item;
      return genFuncItemOfAPBDSL(funcCode, item);
    }
    return false;
  }).filter(v => v);

  return {
    steps: stepsVal
  };
};
