import { useEffect, useMemo } from 'react';
import { genEventWrapFnList, useEventProps } from '../event-manage';
import { useCacheState } from '../utils';
import { APBDSLrequest as originReq } from '../utils/apb-dsl';
import { conditionEngine } from '../condition-engine/condition-engine';
import { APBDSLCondControlResHandle, getAPBDSLCondOperatorHandle } from '../actions-manage/business-actions/APBDSL';
import { transMarkValFromArr, validTransMarkValFromArr } from './utils/transform-mark-value';
import { collectRelationshipFromScheduler } from '../relationship';

export enum RuntimeSchedulerFnName {
  targetUpdateState = 'targetUpdateState',
  updatePageState = 'updatePageState',
  getPageState = 'getPageState',
  getWatchDeps = 'getWatchDeps',
  APBDSLrequest = 'APBDSLrequest',
  ConditionHandleOfAPBDSL = 'ConditionHandleOfAPBDSL'
}

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
const APBDSLrequest = async (reqParam) => {
  const APBDSLRes = await originReq(reqParam);
  const action = {
    action: {
      type: 'APBDSLRes',
      payload: APBDSLRes
    }
  };
  return action;
};

/**
 * TODO: 分类
 * 1. 异步/同步
 * 2. 静态/动态 「运行时useMemo会改变的」
 * TODO: 待修改问题
 * 1. 类型、调用上下文规范
 */
export const genRuntimeCtxFn = (dslParseRes, runtimeCtx) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity, getActionFn,
    renderComponentKeys,
    schemasParseRes,
    getFlowItemInfo,
    datasourceMetaEntity,
  } = dslParseRes;
  console.log('//___genRuntimeCtxFn___\\\\');
  const {
    pageManageInstance,
    IUBStoreEntity, // IUB页面仓库实例
    runTimeCtxToBusiness // useRef
  } = runtimeCtx;
  const {
    getPageState,
    getWatchDeps,
    updatePageState, targetUpdateState,
    IUBPageStore, pickPageStateKeyWord
  } = IUBStoreEntity;

  /** 事件运行调度中心的函数 */
  const asyncRuntimeContext = {
    targetUpdateState,
    updatePageState,
    getPageState,
    getWatchDeps,
    APBDSLrequest,
    ...datasourceMetaEntity
  };
  /** 异步运行时调度中心 */
  const asyncRuntimeScheduler = async (ctx) => {
    const {
      action, type, params, actionName
    } = ctx;
    /** 收集信息 */
    const collectInfo = collectRelationshipFromScheduler(ctx);

    // if (Object.prototype.toString.call(action) === "[object Object]") {
    //   setRunTimeLine([...runTimeLine, action]);
    // }

    if (type === RuntimeSchedulerFnName.ConditionHandleOfAPBDSL) {
      const expsValueHandle = (expsValue) => {
        expsValue = transMarkValFromArr(expsValue, asyncRuntimeContext);

        return validTransMarkValFromArr(expsValue);
      };
      return await conditionEngine(params[0], {
        expsValueHandle,
        condControlResHandle: APBDSLCondControlResHandle,
        getOperatorHandle: getAPBDSLCondOperatorHandle.bind(null, {}), // 外部绑定默认上下文
      });
    }

    const runRes = await asyncRuntimeContext[type](...params);

    /** 修改运行时状态 */
    collectInfo.isRunSuccess = true;

    return runRes;
  };

  const runtimeContext = {
    ...datasourceMetaEntity
  };
  /** 同步运行时调度中心 */
  const runtimeScheduler = (ctx) => {
    const {
      action, type, params, actionName
    } = ctx;
    console.log(ctx);
    return getPageState();
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
      const newState = getPageState(value);
      list.push({
        deps: [newState],
        handle: () => ({ value: newState })
      });
    }
    if (dataSource) {
      const newDataSource = getPageState(dataSource);
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

  /** 在事件运行中使用的上下文 */
  runTimeCtxToBusiness.current = {
    pageMark: runTimeCtxToBusiness.current.pageMark || '',
    asyncRuntimeScheduler,
    runtimeScheduler
  };

  /**
   * 生成运行时事件绑定的props
   * @param dynamicProps 动态的props
   */
  const useRunTimeEventProps = (dynamicProps = {}) => {
    /** 载入上下文,生成实际的fn */
    // watch 事件 用到的state
    const eventWrapFnList = useMemo(() => genEventWrapFnList(dynamicProps, { getFlowItemInfo }), []);

    const eventProps = useEventProps(eventWrapFnList, runTimeCtxToBusiness);
    // const eventProps = {};
    return eventProps;
  };

  return {
    useDynamicPropHandle,
    useRunTimeEventProps,
    runTimeCtxToBusiness
  };
};
