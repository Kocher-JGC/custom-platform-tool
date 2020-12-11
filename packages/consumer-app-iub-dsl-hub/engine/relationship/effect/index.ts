import { APBDSLActionEffect, EffectType, EffectRelationshipEntity } from "../types";
import {
  DispatchModuleName, DispatchMethodNameOfRelationship, DispatchMethodNameOfFlowManage, DispatchCtxOfIUBEngine,
  RunTimeCtxToBusiness
} from "../../runtime/types";

/**
  * apbdsl的副作用分析
  */
const effectAnalysisOfAPBDSLCURD = (APBDSLCURDParam) => {
  // const { businesscode, steps, actionId } = APBDSLCURDParam;
  // const effectInfo: APBDSLActionEffect[] = [];
  // steps.forEach(({ function: { code, params } }) => {
  //   const { table } = params;
  //   switch (code) {
  //     case ApbFunction.DEL:
  //     case ApbFunction.UPD:
  //     case ApbFunction.SET:
  //       effectInfo.push({
  //         actionId,
  //         isImmed: code === ApbFunction.DEL,
  //         effectType: EffectType.tableSelect,
  //         effectInfo: {
  //           table,
  //         },
  //         triggerInfo: {
  //           businesscode
  //         }
  //       });
  //       break;
  //     default:
  //       break;
  //   }
  // });
  // return effectInfo;
  return [];
};

export const effectRelationship = (): EffectRelationshipEntity => {
  const effectCollection: any[] = [];

  /**
   * 动作运行的副作用分析 「收集副作用」
   * @param ctx 运行时调度器标准上下文
   * @param dispatchCtx 调度上下文
   */
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

    /** 当前正在执行的动作类型 */
    const { actionType, actionId } = actionInfo;
    // console.log(actionType, actionId);

    switch (actionType) {
      case 'APBDSLCURDAction':
        shouldUseEffect = () => {
          const effectInfos = effectAnalysisOfAPBDSLCURD({ actionId, ...params[1] });
          effectCollection.push(...effectInfos);
          // TODO: 临时
          return effectInfos[0];
        };
        break;
      default:
        break;
    }

    return shouldUseEffect;
  };

  /**
   * IUBUnMount的副作用调度 「触发副作用」
   * TODO: 多个相同副作用
   * @param c 本页面的运行时调度器标准上下文
   * @param options 选项函数的选项, 目前默认是获取页面上下文的选项
   */
  const effectDispatch = (ctx: RunTimeCtxToBusiness, options) => {
    const { pageManage, pageMark: nowPageMark } = ctx;
    const pageCtxArr = pageManage.getIUBPageCtx(options);
    pageCtxArr.forEach((pCtx) => {
      const { pageMark, dispatchOfIUBEngine, asyncDispatchOfIUBEngine } = pCtx;
      asyncDispatchOfIUBEngine({
        actionInfo: {
          actionType: 'effectCollection',
          actionName: `${pageMark}__effectReceiver`,
          actionId: `${pageMark}__effectReceiver`
        },
        dispatch: {
          module: DispatchModuleName.relationship,
          method: DispatchMethodNameOfRelationship.effectReceiver,
          params: [effectCollection],
        },
      }).then((res) => {
        /** 理论上应该运行几个删除几个 */
        effectCollection.length = 0;
        console.log('副作用处理完成');
        // console.log(res);
      });
    });
  };

  /**
   * 页面接受者, 接收其他页面dispatch的副作用并处理 「处理副作用」
   * @param ctx 运行时调度器标准上下文
   * @param effectCollect 副作用集合
   */
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
