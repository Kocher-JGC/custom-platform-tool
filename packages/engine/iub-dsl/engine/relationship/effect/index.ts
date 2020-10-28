import { ApbFunction } from "@iub-dsl/definition";
import { APBDSLActionEffect, EffectType } from "../types";
import {
  DispatchModuleName, DispatchMethodNameOfRelationship, DispatchMethodNameOfFlowManage, DispatchCtxOfIUBEngine,
  RunTimeCtxToBusiness
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

  const effectAnalysis = (ctx: RunTimeCtxToBusiness, dispatchCtx: DispatchCtxOfIUBEngine) => {
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
          effectCollection.push(...effectAnalysisOfAPBDSLCURD({ actionId, ...params[1] }));
        };
        break;
      default:
        break;
    }

    return shouldUseEffect;
  };
  const effectDispatch = (c: RunTimeCtxToBusiness, allPageCtx: RunTimeCtxToBusiness[]) => {
    allPageCtx.forEach((ctx) => {
      const { pageMark, dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
      console.log(pageMark);
      asyncDispatchOfIUBEngine({
        actionInfo: {
          actionType: 'effectCollection',
          actionName: `${pageMark}__${effectReceiver}`,
          actionId: `${pageMark}__${effectReceiver}`
        },
        dispatch: {
          module: DispatchModuleName.relationship,
          method: DispatchMethodNameOfRelationship.effectReceiver,
          params: [effectCollection],
        },
      }).then((res) => {
        // console.log(res);
      });
    });
  };

  const effectReceiver = (ctx: RunTimeCtxToBusiness, effectCollect: any[]) => {
    const { pageMark, dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = ctx;
    effectCollect.forEach(({ effectType, effectInfo }) => {
      if (effectType === 'tableSelect') {
        const { table } = effectInfo;
        if (table) {
          const flowUseds = dispatchOfIUBEngine({
            dispatch: {
              module: DispatchModuleName.relationship,
              method: DispatchMethodNameOfRelationship.findEquMetadata,
              params: [table],
            },
            actionInfo: {
              actionType: 'effectReceiver',
              actionId: `${pageMark}__${effectType}`,
              actionName: `${pageMark}__${effectType}`
            }
          });
          const flowUsedsFlat = flowUseds?.flat().flat() || [];
          asyncDispatchOfIUBEngine({
            dispatch: {
              module: DispatchModuleName.flowManage,
              method: DispatchMethodNameOfFlowManage.flowsRun,
              params: [flowUsedsFlat],
            },
            actionInfo: {
              actionType: 'effectReceiver',
              actionName: `${pageMark}__effectReceiver`,
              actionId: `${pageMark}__effectReceiver`
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
