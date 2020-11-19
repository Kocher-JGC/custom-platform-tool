import React from 'react';
import { PropItemRendererProps } from '@engine/visual-editor/components/PropertiesEditor';
import { Unexpect } from '../WidgetRenderer';
import { PlatformCtx } from '../../platform-access';

interface PDPropItemRendererProps extends PropItemRendererProps {
  pageMetadata
  platformCtx: PlatformCtx
}

/**
 * 属性项渲染器
 * 根据属性项的 type 选择对应的组件进行渲染
 */
export const PropItemRenderer: React.FC<PDPropItemRendererProps> = ({
  propItemMeta,
  platformCtx,
  editingWidgetState,
  pageMetadata,
  widgetEntity,
  changeEntityState,
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
      changeEntityState,
      widgetEntity,
      platformCtx,
      editingWidgetState,
      pageMetadata,
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
