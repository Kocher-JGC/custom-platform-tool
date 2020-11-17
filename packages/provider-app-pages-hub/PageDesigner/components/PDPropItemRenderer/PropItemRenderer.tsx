import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor';
import { getListOfDictionaryServices, getDictionaryListServices, getTableList } from '@provider-app/services';
import { PlatformUICtx } from '@platform-widget-access/spec';
import { Unexpect } from '../WidgetRenderer';

interface PDPropItemRendererProps extends PropItemRendererProps {
  pageMetadata
  UICtx: PlatformUICtx
}

/**
 * 提供给属性项的服务接口
 */
const servicesForPropItems: PD.PropItemRendererBusinessPayload['$services'] = {
  dict: {
    getDictList: getDictionaryListServices,
    getDictWithSubItems: getListOfDictionaryServices
  },
  table: {
    getTable: getTableList
  }
};

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PDPropItemRendererProps> = ({
  propItemMeta,
  UICtx,
  genMetaRefID,
  takeMeta,
  ...other,
  // renderCtx
}) => {
  const {
    label,
  } = propItemMeta;

  let Com;
  if (!propItemMeta.render) {
    console.log(propItemMeta);
    Com = <Unexpect />;
  } else {
    const propItemRenderContext = {
      // ...renderCtx,
      ...other,
      UICtx,
      genMetaRefID,
      takeMeta,
      businessPayload: {
        $services: servicesForPropItems
      }
    };
    Com = propItemMeta.render(propItemRenderContext);
  }
  return (
    <div className="mb10">
      <div className="label mb5">{label}</div>
      <div className="content">
        {Com}
      </div>
    </div>
  );
};
