/* eslint-disable no-param-reassign */
import React, {
  Fragment, useEffect, useMemo, useRef
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';
import { pageManage } from './page-manage';
import { createIUBStore } from './state-manage';
import { DefaultCtx, genRuntimeCtxFn } from './runtime';
import { effectRelationship as genEffectRelationship } from './relationship';
import { RunTimeCtxToBusiness } from './runtime/types';
import { widgetRenderer } from "./widget-manage";
  
/**
 * 要提供一种注册机制, 动态注册上下文内容
 */
const IUBDSLRuntimeContainer = ({ dslParseRes, hooks, pageStatus, requestHandler, PageRenderer }) => {
  const {
    schemaParseRes,
    getWidgetParseInfo,
    renderWidgetIds,
    pageID: pageId, businessCode, isSearch
  } = dslParseRes;

  /** 获取单例的页面管理 */
  const pageManageInstance = pageManage();

  /** 页面运行时上下文 */
  const runTimeCtxToBusiness = useRef<RunTimeCtxToBusiness>({
    PageRenderer,
    pageStatus,
    pageId,
    pageMark: '',
    action: {},
    requestHandler,
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

  const useIUBStore = useMemo(() => createIUBStore(schemaParseRes), [schemaParseRes]);
  const IUBStoreEntity = useIUBStore();
  
  // TODO: 未加入布局结构, 仅是一层使用  
  const renderWidgetList = useMemo(() => 
    renderWidgetIds.map((id: string) => {
      const widgetConf = getWidgetParseInfo(id);
      const render = widgetRenderer(widgetConf);
      return render;
    })
  , []);
  
  const defaultCtx = useMemo(() => genRuntimeCtxFn(dslParseRes, {
    IUBStoreEntity,
    runTimeCtxToBusiness,
    // effectRelationship,
    businessCode,
  }), [IUBStoreEntity]);

  const extralProps = useMemo(() => ({ extral: '扩展props', isSearch }), []);
  const renderList = renderWidgetList.map((Render, i) => <Render key={renderWidgetIds[i] || i} extralProps={extralProps}/>);

  hooks?.beforeMount?.();

  return (
    <DefaultCtx.Provider value={defaultCtx}>
      <LayoutRenderer
        layoutNode={renderList}
        componentRenderer={({ layoutNodeItem, idx, id, }) => {
          return <Fragment key={idx}><div style={{ margin: 10 }}>{layoutNodeItem}</div></Fragment>;
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
