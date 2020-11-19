import React from 'react';
import Editor, { 
  PropertiesEditorProps
} from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';
import { loadPlatformWidgetMeta, loadPropItemData, loadPropItemGroupingData } from '../services';
import { PlatformContext } from '../utils';

// TODO: 完善属性检查
interface PropsEditorProps {
  interDatasources: PD.Datasources
  pageMetadata
  customConfig?: any
  selectedEntity
  defaultEntityState: PropertiesEditorProps['defaultEntityState']
  initEntityState: PropertiesEditorProps['initEntityState']
  updateEntityState: PropertiesEditorProps['updateEntityState']
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
      interDatasources,
      pageMetadata,
      selectedEntity,
    } = this.props;
    return (
      <PlatformContext.Consumer>
        {
          (platformCtx) => {
            return (
              <PropItemRenderer
                // {...props}
                editingWidgetState={editingWidgetState}
                widgetEntity={selectedEntity}
                propItemMeta={propItemMeta}
                changeEntityState={changeEntityState}
                platformCtx={platformCtx}
                pageMetadata={pageMetadata}
                interDatasources={interDatasources}
              />
            );
          }
        }
      </PlatformContext.Consumer>
    );
  }

  render() {
    const {
      interDatasources,
      pageMetadata,
      initEntityState,
      updateEntityState,
      defaultEntityState,
      ...otherProps
    } = this.props;
    const { widgetMeta, propItemGroupingData, ready } = this.state;
    const widgetBindedPropItemsMeta = widgetMeta.propItemsRely;
    return ready ? (
      <div>
        <Editor
          // {...otherProps}
          getPropItem={this.getPropItem}
          defaultEntityState={defaultEntityState}
          initEntityState={initEntityState}
          updateEntityState={updateEntityState}
          propItemGroupingData={propItemGroupingData}
          widgetBindedPropItemsMeta={widgetBindedPropItemsMeta}
          propItemRenderer={this.propItemRenderer}
        />
      </div>
    ) : null;
  }
}

export default PDPropertiesEditor;
