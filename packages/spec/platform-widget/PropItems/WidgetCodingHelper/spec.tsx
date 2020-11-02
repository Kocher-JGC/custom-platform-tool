import React, { useEffect } from 'react';
import { Label } from '@deer-ui/core/label';
import { PropItemCompAccessSpec, PropItemRenderContext } from '@engine/visual-editor/data-structure';

/** 属性项编辑的组件属性 */
const whichAttr = 'widgetCode';

const WidgetCodeComp: React.FC<PropItemRenderContext> = (props) => {
  const { changeEntityState, editingWidgetState, widgetEntity } = props;
  const { id, widgetRef } = widgetEntity;
  /** 取自身定义的 whichAttr */
  const _value = editingWidgetState[whichAttr];
  useEffect(() => {
    if (_value) return;
    changeEntityState({
      attr: whichAttr,
      value: widgetRef
    });
  }, []);
  return (
    <div>
      <Label>{_value}</Label>
    </div>
  );
};

/**
 * 组件的编码
 */
export const WidgetCodingHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_widget_coding',

  label: '编码',

  whichAttr,

  render: (ctx) => {
    return <WidgetCodeComp {...ctx} />;
  }
};
