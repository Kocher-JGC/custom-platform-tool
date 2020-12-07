/**
 * @author zxj
 *
 * 组件类面板不做组件实例渲染
 */

import React from 'react';

import DragItemComp, { DragItemConfig } from '@engine/visual-editor/spec/DragItemComp';
import { EditableWidgetMeta } from '@engine/visual-editor/data-structure';
import { DragableItemTypes } from '../../spec';
import { GroupPanel, GroupPanelData } from '../GroupPanel';

export type ComponentPanelConfig = GroupPanelData

export interface ComponentPanelProps {
  /** 组件 panel 的配置 */
  componentPanelConfig: ComponentPanelConfig
  widgetMetaDataCollection: any
  /** 可拖拽 item 的包装器 interface */
  itemWrapper?: (item: EditableWidgetMeta) => React.ReactChild
  /** 控制 DragItemComp 的 drag 配置的 interface，详情参考 react-dnd */
  getDragItemConfig?: (item: EditableWidgetMeta) => DragItemConfig
  itemRenderer?: (a, b) => JSX.Element
}

const defaultItemRendererFac = (widgetMetaDataCollection, getDragItemConfig) => (widgetMetaID) => {
  const widgetType = widgetMetaDataCollection[widgetMetaID];
  const {
    name, label
  } = widgetType;
  return (
    <DragItemComp
      key={name}
      id={name}
      className="drag-comp-item"
      type={DragableItemTypes.DragableItemType}
      dragConfig={getDragItemConfig ? getDragItemConfig(widgetType) : {}}
      dragableWidgetType={{
        ...widgetType,
      }}
    >
      {label}
    </DragItemComp>
  );
};

const WidgetPanel: React.FC<ComponentPanelProps> = ({
  componentPanelConfig,
  widgetMetaDataCollection,
  itemRenderer,
  getDragItemConfig
}) => {
  /**
   * 处理 Tabs 更改事件
   */
  const handleChange = () => {
    // console.log('handleChange');
  };

  return (
    <div>
      <GroupPanel
        panelData={componentPanelConfig}
        className="component-panel-container"
        handleChange={handleChange}
        itemRenderer={itemRenderer ?? defaultItemRendererFac(widgetMetaDataCollection, getDragItemConfig)}
      />
    </div>
  );
};

export default WidgetPanel;
