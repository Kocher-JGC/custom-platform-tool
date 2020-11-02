import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';
import { loadPlatformWidgetMeta, loadPropItemData, loadPropItemGroupingData } from '../services';

interface PropsEditorProps extends Omit<PropertiesEditorProps, 'propItemRenderer' | 'widgetBindedPropItemsMeta'> {
  interDatasources: PD.Datasources
  customConfig?: any
  widgetMetaID: string
}

/**
 * Page design prop editor
 */
class PDPropertiesEditor extends React.Component<PropsEditorProps> {
  // TODO: 完成 state 的 interface
  state = {
    ready: false,
    propItemGroupingData: {},
    widgetMeta: {},
    propItemData: {}
  }

  componentDidMount = async () => {
    const { widgetMetaID } = this.props;
    const [
      widgetMeta,
      propItemGroupingData,
      propItemData
    ] = await Promise.all([
      loadPlatformWidgetMeta(widgetMetaID),
      loadPropItemGroupingData(),
      loadPropItemData(),
    ]);
    console.log('propItemData :>> ', propItemData);
    this.setState({
      propItemGroupingData,
      widgetMeta,
      propItemData,
      ready: true
    });
  }

  getPropItem = (propItemID) => {
    return this.state.propItemData[propItemID];
  }

  propItemRenderer = (props) => {
    const {
      ChangeMetadata,
      interDatasources,
      pageMetadata,
    } = this.props;
    return (
      <PropItemRenderer
        {...props}
        pageMetadata={pageMetadata}
        ChangeMetadata={ChangeMetadata}
        interDatasources={interDatasources}
      />
    );
  }

  render() {
    const {
      ChangeMetadata,
      interDatasources,
      pageMetadata,
      widgetMetaID,
      ...otherProps
    } = this.props;
    const { widgetMeta, propItemGroupingData, ready } = this.state;
    const widgetBindedPropItemsMeta = widgetMeta.propItemsRely;
    return ready ? (
      <div>
        <Editor
          {...otherProps}
          getPropItem={this.getPropItem}
          propItemGroupingData={propItemGroupingData}
          widgetBindedPropItemsMeta={widgetBindedPropItemsMeta}
          pageMetadata={pageMetadata}
          ChangeMetadata={ChangeMetadata}
          propItemRenderer={this.propItemRenderer}
        />
      </div>
    ) : null;
  }
}

export default PDPropertiesEditor;
