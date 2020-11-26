/* eslint-disable no-param-reassign */
import React, {
  Fragment,
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { pageManage } from '@consumer-app/web-platform/src/page-manage';
import { createIUBStore } from './state-manage';
import { DefaultCtx, genRuntimeCtxFn } from './runtime';
import { effectRelationship as genEffectRelationship } from './relationship';
import { RunTimeCtxToBusiness } from './runtime/types';
import { widgetRenderer } from "./widget-manage";

const IUBDSLRuntimeContainer = ({ dslParseRes, hooks, pageStatus }) => {
  const {
    getWidgetParseInfo,
    schemas, mappingEntity,
    renderWidgetIds,
    schemasParseRes, pageID: pageId, businessCode, isSearch
  } = dslParseRes;

  /** 获取单例的页面管理 */
  const pageManageInstance = pageManage();

  /** 页面运行时上下文 */
  const runTimeCtxToBusiness = useRef<RunTimeCtxToBusiness>({
    pageStatus,
    pageId,
    pageMark: '',
    action: {},
    pageManage: pageManageInstance,
    asyncDispatchOfIUBEngine: async (dispatchCtx) => false,
    dispatchOfIUBEngine: (dispatchCtx) => false
  });

  const effectRelationship = useMemo(() => genEffectRelationship(), []);

  /** 页面管理添加页面上下文 */
  useEffect(() => {
    // ?? 是否初始化的是否就要添加页面上下文, 而不是页面挂载完成
    const { pageMark, removeFn } = pageManageInstance.addPageCtx({
      pageId,
      pageType: 'IUBPage',
      context: runTimeCtxToBusiness
    });
    runTimeCtxToBusiness.current.pageMark = pageMark;
    /** 页面正式挂载完成 */
    hooks?.mounted?.({ pageMark, pageId, runTimeCtxToBusiness });

    return () => {
      removeFn();
      hooks?.unmounted?.({ pageMark, pageId, runTimeCtxToBusiness });
      effectRelationship.effectDispatch(runTimeCtxToBusiness.current, { pageIdOrMark: '' });
    };
  }, []);

  // const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [schemasParseRes]);
  // const IUBStoreEntity = useIUBStore();
  // const {
  //   getPageState
  // } = IUBStoreEntity;

  // TODO: 未加入布局结构, 仅是一层使用
  console.log(renderWidgetIds);
  
  const actualRenderComponentList = renderWidgetIds.map((id) => {
    const widgetConf = getWidgetParseInfo(id);
    const render = widgetRenderer(widgetConf);
    return render;
  });

  console.log(actualRenderComponentList);
  
  // const defaultCtx = useMemo(() => genRuntimeCtxFn(dslParseRes, {
  //   IUBStoreEntity,
  //   runTimeCtxToBusiness,
  //   // effectRelationship,
  //   businessCode,
  // }), [IUBStoreEntity]);

  const extralProps = useMemo(() => ({ extral: '扩展props', isSearch }), []);

  hooks?.beforeMount?.();

  return (
    <DefaultCtx.Provider value={{}}>
      <LayoutRenderer
        layoutNode={actualRenderComponentList}
        componentRenderer={({ layoutNodeItem, idx, id, }) => {
          return <Fragment key={idx}>{layoutNodeItem}</Fragment>;
        }}
        // RootRender={(child) => {
        //   return child;
        // }}
      />
      {/* <pre>
        {JSON.stringify(getPageState(), null, 2)}
      </pre> */}
    </DefaultCtx.Provider>

  );
};

export default IUBDSLRuntimeContainer;
