import { ApbFunction } from "@iub-dsl/definition";
import { APBDSLActionEffect, EffectType } from "../types";
import {
  DispatchModuleName, DispatchMethodNameOfRelationship, DispatchMethodNameOfFlowManage, DispatchCtxOfIUBEngine
} from "../../runtime/types";

/**
  * apbdsl的副作用分析
  */
const effectAnalysisOfAPBDSLCURD = (APBDSLCURDParam): APBDSLActionEffect[] => {
  const { businesscode, steps, actionId } = APBDSLCURDParam;
  const effectInfo: APBDSLActionEffect[] = [];
  steps.forEach(({ function: { code, params } }) => {
    const { table } = params;
    switch (code) {
      case ApbFunction.DEL:
      case ApbFunction.UPD:
      case ApbFunction.SET:
        effectInfo.push({
          actionId,
          effectType: EffectType.tableSelect,
          effectInfo: {
            table,
          },
          triggerInfo: {
            businesscode
          }
        });
        break;
      default:
        break;
    }
  });
  return effectInfo;
};

export const effectRelationship = () => {
  const effectCollection: any[] = [];

  const effectAnalysis = (dispatchCtx: DispatchCtxOfIUBEngine) => {
    const {
      actionInfo,
      dispatch: { params }
      // action = {}, type, params, actionName
    } = dispatchCtx;
    let shouldUseEffect = () => {};
    if (!actionInfo) {
      console.warn('noActionInfo');
      return shouldUseEffect;
    }

    const { actionType, actionId } = actionInfo;
    // console.log(actionType, actionId);

    switch (actionType) {
      case 'APBDSLCURDAction':
        shouldUseEffect = () => {
          effectCollection.push(...effectAnalysisOfAPBDSLCURD({ actionId, ...params[0] }));
        };
        break;
      default:
        break;
    }

    return shouldUseEffect;
  };
  const effectDispatch = (allPageCtx) => {
    allPageCtx.forEach((ctx) => {
      const { pageMark, dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
      console.log(pageMark);
      asyncDispatchOfIUBEngine({
        actionInfo: {
          type: 'effectCollection'
        },
        dispatch: {
          module: DispatchModuleName.relationship,
          method: DispatchMethodNameOfRelationship.effectReceiver,
          params: [effectCollection, ctx],
        },
      }).then((res) => {
        // console.log(res);
      });
    });
  };

  const effectReceiver = (effectCollect: any[], ctx) => {
    const { pageMark, dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
    effectCollect.forEach(({ effectType, effectInfo }) => {
      if (effectType === 'tableSelect') {
        const { table } = effectInfo;
        if (table) {
          const flowUseds = dispatchOfIUBEngine({
            dispatch: {
              module: DispatchModuleName.relationship,
              method: DispatchMethodNameOfRelationship.findEquMetadata,
              params: [table, ctx],
            },
            actionInfo: {
              type: 'effectReceiver'
            }
          });
          const flowUsedsFlat = flowUseds?.flat().flat() || [];
          asyncDispatchOfIUBEngine({
            dispatch: {
              module: DispatchModuleName.flowManage,
              method: DispatchMethodNameOfFlowManage.flowsRun,
              params: [flowUsedsFlat, ctx],
            },
            actionInfo: {
              type: 'effectReceiver'
            }
          });
        }
      }
    });
    console.log(effectCollect);
  };

  return {
    effectAnalysis,
    effectDispatch,
    effectReceiver
  };
};
