import React from 'react';
import Editor, { 
  PropertiesEditorProps
} from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from '../PDPropItemRenderer';
import { loadPlatformWidgetMeta, loadPropItemData, loadPropItemGroupingData } from '../../services';
import { PlatformContext } from '../../utils';
import { groupPropItem } from './prop-item-group-shape';

// TODO: 完善属性检查
interface PropsEditorProps {
  interDatasources: PD.Datasources
  pageMetadata
  customConfig?: any
  selectedEntity
  entityState: PropertiesEditorProps['entityState']
  initEntityState: PropertiesEditorProps['initEntityState']
  changeEntityState: PropertiesEditorProps['changeEntityState']
  updateEntityState: PropertiesEditorProps['updateEntityState']
}

const prepareData = async (widgetRef) => {
  const [
    widgetMeta,
    propItemGroupingData,
    propItemData
  ] = await Promise.all([
    loadPlatformWidgetMeta(widgetRef),
    loadPropItemGroupingData(),
    loadPropItemData(),
  ]);

  // const propItemGroupingData = groupPropItem(propItemData);

  return {
    widgetMeta,
    propItemGroupingData,
    propItemData
  };
};

/**
 * Page design prop editor
 */
export class PDPropertiesEditor extends React.Component<PropsEditorProps> {
  // TODO: 完成 state 的 interface
  state = {
    ready: false,
    propItemGroupingData: {},
    widgetMeta: {},
    propItemData: {}
  }

  componentDidMount = async () => {
    const { selectedEntity } = this.props;
    
    const {
      propItemGroupingData,
      widgetMeta,
      propItemData
    } = await prepareData(selectedEntity.widgetRef);

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
      initEntityState,
      changeEntityState,
      updateEntityState,
      entityState,
    } = this.props;
    const { widgetMeta, propItemGroupingData, ready } = this.state;
    const widgetBindedPropItemsMeta = widgetMeta.propItemsRely;
    return ready ? (
      <div>
        <Editor
          // {...otherProps}
          getPropItem={this.getPropItem}
          entityState={entityState}
          updateEntityState={updateEntityState}
          initEntityState={initEntityState}
          changeEntityState={changeEntityState}
          propItemGroupingData={propItemGroupingData}
          widgetBindedPropItemsMeta={widgetBindedPropItemsMeta}
          propItemRenderer={this.propItemRenderer}
        />
      </div>
    ) : null;
  }
}
