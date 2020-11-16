import React from 'react';
import Editor, { PropertiesEditorProps } from '@engine/visual-editor/components/PropertiesEditor';
import { PropItemRenderer } from './PDPropItemRenderer';
import { UICtx } from '@platform-widget-access/spec';
import { message } from 'antd';
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

  /**
   * 由页面设计器提供给属性项使用的 UI 上下文
   */
  UICtx: UICtx = {
    utils: {
      showMsg: (ctx) => {
        const { msg, type } = ctx;
        message[type](msg);
      }
    }
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
    const {
      changeMetadata,
      interDatasources,
      pageMetadata,
    } = this.props;
    return (
      <PropItemRenderer
        {...props}
        UICtx={this.UICtx}
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
