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
  // console.log('schema :>> ', schema);
  /** 取自身定义的 whichAttr */
  const _value = widgetCode;
  useEffect(() => {
    if (schema || !_value) {
      const fieldCode = schema.column?.fieldCode;
      changeEntityState({
        attr: 'widgetCode',
        value: fieldCode || `${widgetRef}.${lastCompID}`
      });
    }
  }, [schema]);
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

  whichAttr: ['field', 'widgetCode'],

  useMeta: ['schema'],

  render: (ctx) => {
    return <WidgetCodeComp {...ctx} />;
  }
};
