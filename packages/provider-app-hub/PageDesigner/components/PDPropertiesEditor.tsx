import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';
import { useWidgetMeta } from '../utils';

interface PropsEditorProps extends Omit<PropertiesEditorProps, 'propItemRenderer' | 'widgetBindedPropItemsMeta'> {
  interDatasources: PD.Datasources
  customConfig?: any
  widgetMetaID: string
}

/**
 * Page design prop editor
 */
const PDPropertiesEditor = ({
  ChangeMetadata,
  interDatasources,
  pageMetadata,
  widgetMetaID,
  ...otherProps
}: PropsEditorProps) => {
  const [ready, widgetMeta] = useWidgetMeta(widgetMetaID);
  const widgetBindedPropItemsMeta = widgetMeta.propItemsRely;
  return (
    <div>
      <Editor
        {...otherProps}
        widgetBindedPropItemsMeta={widgetBindedPropItemsMeta}
        pageMetadata={pageMetadata}
        ChangeMetadata={ChangeMetadata}
        propItemRenderer={(props) => {
          return (
            <PropItemRenderer
              {...props}
              pageMetadata={pageMetadata}
              ChangeMetadata={ChangeMetadata}
              interDatasources={interDatasources}
            />
          );
        }}
      />
    </div>
  );
};

export default PDPropertiesEditor;
