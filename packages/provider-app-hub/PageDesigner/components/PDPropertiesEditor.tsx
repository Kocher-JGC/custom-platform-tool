import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';
import { loadPlatformWidgetMeta, loadPropItemData, loadPropItemGroupingData } from '../services';

interface PropsEditorProps extends Omit<PropertiesEditorProps, 'propItemRenderer' | 'widgetBindedPropItemsMeta'> {
  interDatasources: PD.Datasources
  customConfig?: any
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
    const { selectedEntity } = this.props;
    const [
      widgetMeta,
      propItemGroupingData,
      propItemData
    ] = await Promise.all([
      loadPlatformWidgetMeta(selectedEntity.widgetRef),
      loadPropItemGroupingData(),
      loadPropItemData(),
    ]);
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
    // console.log('props :>> ', props);
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
