import React, { useEffect } from 'react';
import { Label } from '@deer-ui/core/label';
import { PropItemCompAccessSpec, PropItemRenderContext } from '@engine/visual-editor/data-structure';

const WidgetCodeComp: React.FC<PropItemRenderContext> = (props) => {
  const {
    changeEntityState, editingWidgetState, widgetEntity, takeMeta, businessPayload
  } = props;
  const { id, widgetRef } = widgetEntity;
  const { widgetCode, field } = editingWidgetState;
  const schema = takeMeta({
    metaAttr: 'schema',
    metaRefID: field
  });
  const lastCompID = takeMeta({
    metaAttr: 'lastCompID',
  });
  /** 取自身定义的 whichAttr */
  useEffect(() => {
    let nextWidgetCode;
    /**
     * 业务需求逻辑
     * 1. 如果绑定了列名，则使用列名作为控件编码
     * 2. 如果没有绑定，控件编码为 `控件类型 + 组件数量`
     */
    if (field && schema) {
      nextWidgetCode = schema.column?.fieldCode;
    } else {
      nextWidgetCode = widgetCode || `${widgetRef}.${lastCompID}`;
    }
    changeEntityState({
      attr: 'widgetCode',
      value: nextWidgetCode
    });
  }, [schema]);
  return (
    <div>
      <Label>{widgetCode}</Label>
    </div>
  );
};

/**
 * 组件的编码
 */
export const WidgetCodingHelperSpec: PropItemCompAccessSpec = {
  id: 'prop_widget_coding',
  name: 'PropWidgetCodeing',
  label: '编码',
  whichAttr: ['field', 'widgetCode'],
  useMeta: ['schema'],
  render: (ctx) => {
    return <WidgetCodeComp {...ctx} />;
  }
};
