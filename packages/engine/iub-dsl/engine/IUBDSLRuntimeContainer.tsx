/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { conditionParser } from '@iub-dsl/definition/condition/condition';
import { widgetRenderer, genCompRenderFC } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { genEventWrapFnList, useEventProps } from './event-manage';
import { renderStructInfoListRenderer } from './component-manage/component-store/render-widget-struct';
import { useCacheState } from './utils';
import { APBDSLrequest } from './utils/apb-dsl';

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

const genRuntimeCtxFn = (dslParseRes, runtimeCtx) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity, getActionFn,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  console.log('//___genRuntimeCtxFn___\\\\');
  const {
    IUBStoreEntity,
    runTimeLine,
    setRunTimeLine
  } = runtimeCtx;
  const {
    getPageState,
    getWatchDeps,
    updatePageState, targetUpdateState,
    IUBPageStore, pickKeyWord, isPageState
  } = IUBStoreEntity;

  const runtimeContext = {
    targetUpdateState,
    getPageState,
    getWatchDeps,
    APBDSLrequest
  };
  const runtimeFnScheduler = ({ action, type, params }) => {
    // if (Object.prototype.toString.call(action) === "[object Object]") {
    //   setRunTimeLine([...runTimeLine, action]);
    // }
    const runRes = runtimeContext[type](...params);
    return runRes;
  };

  /**
   * !! 注意: 引用关系的处理「一大难题」
   * ?? 错误的想法/做法:
   * 1. 在useXX中, 不要做一些有副作用的事情. 如修改deps
   * 2. 既然是动态的props, 仅运行一次, 是有问题的.
   *  「有什么好的办法进行针对的合理的运行, 使其需要运行时正确获取/修改数据」
   *  「最根本问题: props, 没有根据state正常更新「学习参考redux」」
   * 3.
   */
  const useDynamicPropHandle = (dynamicProps: any = {}) => {
    const { value } = dynamicProps;

    /** 载入上下文,生成实际的fn */
    // watch 事件 用到的state
    const eventWrapFnList = useMemo(() => genEventWrapFnList(dynamicProps, { getActionFn }), []);

    const eventProps = useEventProps(eventWrapFnList, runtimeFnScheduler);

    const list: any[] = [];
    if (value) {
      const newState = getPageState(value);
      list.push({
        deps: [newState],
        handle: () => ({ value: newState })
      });
    }
    const propp = useUU(list);
    return useMemo(() => {
      return {
        ...eventProps,
        ...propp
      };
    }, [
      propp,
      eventProps
    ]);
  };

  // 先放着
  const conditionParamHandle = (originHandle, ctx) => {
    return (param) => {
      const { expsValue } = param;
      param.expsValue = expsValue.map((val) => getPageState(val));
      return originHandle(param);
    };
  };

  return {
    useDynamicPropHandle,
    conditionParamHandle
  };
};

export const DefaultCtx = React.createContext<any>({});
export const RunTimeCtx = React.createContext<any>({});

const IUBDSLRuntimeContainer = React.memo<{dslParseRes: any}>(({ dslParseRes }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    renderComponentKeys,
    schemasParseRes,
  } = dslParseRes;
  const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [schemasParseRes]);
  const IUBStoreEntity = useIUBStore();
  const {
    getPageState, updatePageState, IUBPageStore
  } = IUBStoreEntity;
  const [runTimeLine, setRunTimeLine] = useState([]);

  // useTempCode(IUBStoreEntity);

  const genCompRenderFCToUse = useMemo(() => {
    return genCompRenderFC(getWidget);
  }, [getWidget]);

  // TODO: 未加入布局结构, 仅是一层使用
  const actualRenderComponentList = renderComponentKeys.map((id) => {
    const { renderCompInfo, renderStructInfo } = getCompParseInfo(id);
    // 单独的组件渲染
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compRendererFCList = useMemo(() => {
      return Object.keys(renderCompInfo).reduce((res, mark) => {
        res[mark] = genCompRenderFCToUse(renderCompInfo[mark]);
        return res;
      }, {});
    }, [renderCompInfo]);
    // 单独的结构渲染
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useMemo(() => {
      const Widget = widgetRenderer(
        renderStructInfoListRenderer(
          renderStructInfo, compRendererFCList
        )
      );
      return {
        id,
        Widget
      };
    }, [
      compRendererFCList, renderStructInfo
    ]);
  });

  const ctx = useMemo(() => genRuntimeCtxFn(dslParseRes, {
    IUBStoreEntity,
    APBDSLrequest,
    runTimeLine,
    setRunTimeLine
  }), [IUBStoreEntity]);

  // console.log('conditionValue ---> ', conditionParser(ctx));

  const extralProps = useMemo(() => ({ extral: '扩展props' }), []);

  return (
    <DefaultCtx.Provider value={ctx}>
      <pre>
        {JSON.stringify(getPageState(), null, 2)}
      </pre>
      <FromWrapFactory>
        <LayoutRenderer
          layoutNode={actualRenderComponentList}
          componentRenderer={({ layoutNodeItem }) => {
            const { id: compId, Widget } = layoutNodeItem;

            return <Widget key={compId} {...extralProps}/>;
          }}
          RootRender={(child) => {
            return (<div>
              {child}
            </div>);
          }}
        />
      </FromWrapFactory>
    </DefaultCtx.Provider>
  );
}, (prev, next) => {
  // console.log(prev?.dslParseRes?.pageID === next?.dslParseRes?.pageID);

  return prev?.dslParseRes?.pageID === next?.dslParseRes?.pageID;
});

export default IUBDSLRuntimeContainer;

const useTempCode = ({ updatePageState }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePageState({
        a: 'b',
        entity_26: 'entity_263hj  '
      });
      setTimeout(() => {
        updatePageState({
          c: 'bdd',
        });
      }, 2000);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
};
