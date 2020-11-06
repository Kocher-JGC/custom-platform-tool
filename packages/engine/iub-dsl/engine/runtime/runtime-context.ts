/* eslint-disable no-shadow */
import { notification } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { getAPBDSLtestUrl } from '@consumer-app/web-platform/src/utils/gen-url';
import { DispatchMethodNameOfCondition } from './types/diapatch-module/dispatch-module-condition';
import { genEventWrapFnList, useEventProps } from '../event-manage';
import { useCacheState } from '../utils';
import { APBDSLrequest as originReq } from '../utils/apb-dsl';
import { conditionEngine } from '../condition-engine/condition-engine';
import { APBDSLCondControlResHandle, getAPBDSLCondOperatorHandle } from '../actions-manage/business-actions/APBDSL';
import { transMarkValFromArr, validTransMarkValFromArr } from './utils/transform-mark-value';
import {
  DispatchCtxOfIUBEngine, Dispatch,
  IUBEngineRuntimeCtx, AsyncIUBEngineRuntimeCtx, RunTimeCtxToBusiness,
} from './types';
import { whenHandle } from '../condition-engine/when-handle';
import { GRCtx } from './types/runtime-context';

const useUU = (setListConf: any[] = []) => {
  const [prop, setProp] = useCacheState({});
  setListConf.forEach(({ deps = [], handle }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setProp(handle(prop));
    }, deps);
  });
  return prop;
};

const APBDSLrequest = (url) => async (ctx: RunTimeCtxToBusiness, reqParam, search) => {
  const APBDSLRes = await originReq(url, reqParam);
  if (APBDSLRes) {
    if (!search) {
      notification.success({
        message: '请求成功!',
      });
    }
    const action = {
      action: {
        type: 'APBDSLRes',
        payload: APBDSLRes
      }
    };
    return action;
  }
  return {};
};

const getDispatchMethod = (
  { module, method }: Dispatch,
  runtimeContext: AsyncIUBEngineRuntimeCtx | IUBEngineRuntimeCtx
) => {
  /** 获取调度的模块 */
  const moduleToUse = runtimeContext[module];
  if (!moduleToUse) {
    console.error('调度中心模块获取失败!!', module);
    return false;
  }

  /** 获取调度的方法 */
  const dispatchMethod = moduleToUse[method];
  if (!dispatchMethod) {
    console.error('调度中心方法失败!!', method);
    return false;
  }
  return dispatchMethod;
};

export const genRuntimeCtxFn = (dslParseRes, runtimeCtx: GRCtx) => {
  const {
    // layoutContent, componentParseRes, getCompParseInfo,
    // schemas, mappingEntity, getActionFn,
    // renderComponentKeys,
    // schemasParseRes,
    findEquMetadata,
    getFlowItemInfo,
    datasourceMetaEntity,
    flowsRun,
  } = dslParseRes;
  console.log('//___genRuntimeCtxFn___\\\\');
  const {
    IUBStoreEntity, // IUB页面仓库实例
    runTimeCtxToBusiness, // useRef
    effectRelationship, // 副作用关系的实例
    businessCode
  } = runtimeCtx;
  const {
    getPageState,
    // getWatchDeps,
    // updatePageState, targetUpdateState,
    // IUBPageStore, pickPageStateKeyWord
  } = IUBStoreEntity;

  const { effectAnalysis, effectDispatch } = effectRelationship;

  /** 事件运行调度中心的函数 */
  /**
   * ?!性能:区分静态上下文和动态上下文
   * 同步调度的上下文
   */
  const runtimeContext: IUBEngineRuntimeCtx = {
    IUBStore: {
      ...IUBStoreEntity
    },
    actionMenage: {
      string: () => {},
    },
    metadata: {
      ...datasourceMetaEntity,
    },
    relationship: {
      findEquMetadata,
      ...effectRelationship,
    },
  };
  /**
   * ?!性能:区分静态上下文和动态上下文
   * 异步调度的上下文
   */
  const asyncRuntimeContext: AsyncIUBEngineRuntimeCtx = {
    IUBStore: {
      ...IUBStoreEntity
    },
    actionMenage: {
      string: () => {},
    },
    metadata: {
      ...datasourceMetaEntity,
    },
    relationship: {
      findEquMetadata,
      ...effectRelationship,
    },
    condition: {
      ConditionHandleOfAPBDSL: conditionEngine,
      ConditionHandle: conditionEngine
    },
    flowManage: {
      flowsRun
    },
    sys: {
      APBDSLrequest: APBDSLrequest(getAPBDSLtestUrl(businessCode[0] || 'queryPerson'))
    },
  };

  /** 异步运行时调度中心 */
  const asyncDispatchOfIUBEngine = async (ctx: DispatchCtxOfIUBEngine) => {
    const { actionInfo, dispatch } = ctx;
    const { module, method, params } = dispatch;

    // console.log(ctx);
    // console.count('-----asyncDispatchOfIUBEngine----');

    /** 获取实际运行的函数 */
    const dispatchMethod = getDispatchMethod(dispatch, asyncRuntimeContext);
    /** 断言 */
    if (typeof dispatchMethod !== 'function') {
      console.error('调度方法获取异常, 非方法!', dispatchMethod);
      return false;
    }

    /** 生成副作用信息 */
    const shouldUseEffect = effectAnalysis(runTimeCtxToBusiness.current, ctx);
    // 临时代码
    // shouldUseEffect();

    if (method === DispatchMethodNameOfCondition.ConditionHandleOfAPBDSL) {
      const expsValueHandle = (expsValue) => {
        expsValue = transMarkValFromArr(runTimeCtxToBusiness.current, expsValue);
        return validTransMarkValFromArr(expsValue);
      };
      return await conditionEngine(
        runTimeCtxToBusiness.current,
        params[0], {
          expsValueHandle,
          condControlResHandle: APBDSLCondControlResHandle,
          getOperatorHandle: getAPBDSLCondOperatorHandle
        }
      );
    }
    if (method === DispatchMethodNameOfCondition.ConditionHandle) {
      return await whenHandle(
        runTimeCtxToBusiness.current,
        params[0].when || []
      );
    }

    params.unshift(runTimeCtxToBusiness.current);

    const runRes = await dispatchMethod(...params);

    // /** 确定副作用信息可以被使用 */
    const effectInfo = shouldUseEffect();
    /** 执行需要立即执行的副作用 */
    if (effectInfo && effectInfo.isImmed) {
      effectDispatch(runTimeCtxToBusiness.current, { pageIdOrMark: runTimeCtxToBusiness.current.pageMark });
    }

    return runRes;
  };

  /** 同步运行时调度中心 */
  const dispatchOfIUBEngine = (ctx: DispatchCtxOfIUBEngine) => {
    const { actionInfo, dispatch } = ctx;
    const { module, method, params } = dispatch;

    // console.log(ctx);
    // console.count('-----dispatchOfIUBEngine----');

    const dispatchMethod = getDispatchMethod(dispatch, runtimeContext);
    /** 断言 */
    if (typeof dispatchMethod !== 'function') {
      console.error('调度方法获取异常, 非方法!', dispatchMethod);
      return false;
    }

    params.unshift(runTimeCtxToBusiness.current);

    return dispatchMethod(...params);
  };

  /**
   * @description 处理动态的props
   * !! 注意: 引用关系的处理「一大难题」
   * ?? 错误的想法/做法:
   * 1. 在useXX中, 不要做一些有副作用的事情. 如修改deps
   * 2. 既然是动态的props, 仅运行一次, 是有问题的.
   *  「有什么好的办法进行针对的合理的运行, 使其需要运行时正确获取/修改数据」
   *  「最根本问题: props, 没有根据state正常更新「学习参考redux」」
   * 3.
   */
  const useDynamicPropHandle = (dynamicProps: any = {}) => {
    const { value, dataSource } = dynamicProps;

    const list: any[] = [];
    if (value) {
      const newState = getPageState(runTimeCtxToBusiness.current, value);
      list.push({
        deps: [newState],
        handle: () => ({ value: newState })
      });
    }
    if (dataSource) {
      const newDataSource = getPageState(runTimeCtxToBusiness.current, dataSource);
      list.push({
        deps: [newDataSource],
        handle: () => ({
          dataSource: newDataSource
        })
      });
    }
    const propp = useUU(list);

    return useMemo(() => {
      return {
        ...propp
      };
    }, [
      propp,
    ]);
  };

  /** 更新在事件运行中使用的上下文 */
  runTimeCtxToBusiness.current = {
    pageId: runTimeCtxToBusiness.current.pageId,
    pageMark: runTimeCtxToBusiness.current.pageMark,
    pageManage: runTimeCtxToBusiness.current.pageManage,
    pageStatus: runTimeCtxToBusiness.current.pageStatus,
    asyncDispatchOfIUBEngine,
    dispatchOfIUBEngine
  };

  /**
   * 生成运行时事件绑定的props
   * @param dynamicProps 动态的props
   */
  const useRunTimeEventProps = (dynamicProps = {}, renderCompInfo) => {
    /** 载入上下文,生成实际的fn */
    // watch 事件 用到的state
    const eventWrapFnList = useMemo(() => genEventWrapFnList(dynamicProps, { getFlowItemInfo, renderCompInfo }), []);

    const eventProps = useEventProps(eventWrapFnList, runTimeCtxToBusiness);
    // const eventProps = {};
    return eventProps;
  };

  return {
    pageStatus: runTimeCtxToBusiness.current.pageStatus,
    useDynamicPropHandle,
    useRunTimeEventProps,
    runTimeCtxToBusiness
  };
};
