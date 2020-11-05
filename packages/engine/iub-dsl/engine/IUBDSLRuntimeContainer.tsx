/* eslint-disable no-param-reassign */
import React, {
  useEffect, useMemo, useCallback, useContext, useRef, useState
} from 'react';
import { LayoutRenderer } from '@engine/layout-renderer';

import { pageManage } from '@consumer-app/web-platform/src/page-manage';

import Modal from 'antd/lib/modal/Modal';
import { widgetRenderer, genCompRenderFC } from './component-manage/component-store/render-component';
import { getWidget } from './component-manage/UI-factory/all-UI';
import { FromWrapFactory } from './component-manage/UI-factory';
import { createIUBStore } from './state-manage';
import { renderStructInfoListRenderer } from './component-manage/component-store/render-widget-struct';

import { DefaultCtx, genRuntimeCtxFn } from './runtime';
import { effectRelationship as genEffectRelationship } from './relationship';
import { RunTimeCtxToBusiness } from './runtime/types';

const IUBDSLRuntimeContainer = ({ dslParseRes, hooks, pageStatus }) => {
  const {
    layoutContent, componentParseRes, getCompParseInfo,
    schemas, mappingEntity,
    renderComponentKeys,
    schemasParseRes, pageID: pageId, businessCode
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

  const useIUBStore = useMemo(() => createIUBStore(schemasParseRes), [schemasParseRes]);
  const IUBStoreEntity = useIUBStore();
  const {
    getPageState
  } = IUBStoreEntity;

  // const [runTimeLine, setRunTimeLine] = useState([]);

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

  const defaultCtx = useMemo(() => genRuntimeCtxFn(dslParseRes, {
    IUBStoreEntity,
    runTimeCtxToBusiness,
    effectRelationship,
    businessCode,
  }), [IUBStoreEntity]);

  const extralProps = useMemo(() => ({ extral: '扩展props' }), []);

  hooks?.beforeMount?.();

  return (
    <DefaultCtx.Provider value={defaultCtx}>
      <FromWrapFactory >
        <LayoutRenderer
          layoutNode={actualRenderComponentList}
          componentRenderer={({ layoutNodeItem }) => {
            const { id: compId, Widget } = layoutNodeItem;

            return <Widget key={compId} extralProps={extralProps}/>;
          }}
          RootRender={(child) => {
            // return (<div>
            //   {child}
            // </div>);
            return child;
          }}
        />
      </FromWrapFactory>

      {/* <pre>
        {JSON.stringify(getPageState(), null, 2)}
      </pre> */}
    </DefaultCtx.Provider>

  );
};

export default IUBDSLRuntimeContainer;
