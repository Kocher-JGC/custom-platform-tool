import React from 'react';
import Editor, { 
// PropertiesEditorProps
} from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';
import { PlatformUICtx } from '@platform-widget-access/spec';
import { loadPlatformWidgetMeta, loadPropItemData, loadPropItemGroupingData } from '../services';
import { PDUICtx } from '../utils';

// TODO: 完善属性检查
interface PropsEditorProps {
  interDatasources: PD.Datasources
  customConfig?: any
  // UICtx: PlatformUICtx
  genMetaRefID
  takeMeta
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

  propItemRenderer = ({
    propItemMeta,
    changeEntityState,
    editingWidgetState
  }) => {
    // console.log(changeEntityState);
    const {
      changeMetadata,
      interDatasources,
      pageMetadata,
      genMetaRefID,
      selectedEntity,
      takeMeta,
    } = this.props;
    return (
      <PropItemRenderer
        // {...props}
        editingWidgetState={editingWidgetState}
        widgetEntity={selectedEntity}
        propItemMeta={propItemMeta}
        changeEntityState={changeEntityState}
        UICtx={PDUICtx}
        takeMeta={takeMeta}
        genMetaRefID={genMetaRefID}
        pageMetadata={pageMetadata}
        changeMetadata={changeMetadata}
        interDatasources={interDatasources}
      />
    );
  }

  render() {
    const {
      changeMetadata,
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
          changeMetadata={changeMetadata}
          propItemRenderer={this.propItemRenderer}
        />
      </div>
    ) : null;
  }
}

export default PDPropertiesEditor;
