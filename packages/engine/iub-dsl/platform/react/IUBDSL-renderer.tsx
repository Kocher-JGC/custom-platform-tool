import React, { useEffect } from 'react';
import { IUBDSLParser, IUBDSLRuntimeContainer } from '@iub-dsl/engine';

const resolvedDsl: {
  [pageId: string]: any; // IUB_DSL解析结果
} = {

};

const hooksEg = {
  beforeParse: () => {},
  afterParse: () => {},
  beforeMount: () => {},
  mounted: () => {},
  unmounted: () => {},
};

/** IUB-DSL引擎对外暴露的组件 */
const IUBDSLRenderer = ({ dsl, hooks = {} as any, pageStatus = '' }) => {
  const { pageID } = dsl;

  if (pageID === "" || typeof pageID !== 'string') {
    return <ErrorRenderer msg='IUB-DSL Data Error'/>;
  }

  let dslParseRes;
  let ActualRender = <ErrorRenderer/>;
  try {
    if (!(dslParseRes = resolvedDsl[pageID])) {
      hooks?.beforeParse?.();
      dslParseRes = IUBDSLParser({ dsl });
      /** 现在先不缓存解析结果 */
      // resolvedDsl[dsl.pageID] = dslParseRes;
      hooks?.afterParse?.();
    }
  } catch (e) {
    console.error(e);
    ActualRender = (<ErrorRenderer msg='IUB-DSLEngine Parser Error?'/>);
  }

  if (dslParseRes) {
    ActualRender = <IUBDSLRuntimeContainer key={pageID} pageStatus={pageStatus} hooks={hooks} dslParseRes={dslParseRes} />;
  }

  return ActualRender;
};

const ErrorRenderer = ({ msg = '未知' }) => (<div>渲染错误; 错误信息: {msg}</div>);

export {
  IUBDSLRenderer
};
