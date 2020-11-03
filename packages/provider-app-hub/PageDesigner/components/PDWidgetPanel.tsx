import React, { useCallback, useMemo } from 'react';
import { ComponentPanelProps } from '@engine/visual-editor/components/WidgetPanel';
import DragItemComp from '@engine/visual-editor/spec/DragItemComp';
import { DragableItemTypes } from '@engine/visual-editor/spec';
import { Tab, Tabs } from '@infra/ui';
import { GroupItemsRender, ItemRendererType } from '@engine/visual-editor/components/GroupPanel';
import { LoadingTip } from '@provider-ui/loading-tip';
import { DataSourceDragItem, DataSourceSelector } from './PDDataSource';
import { useWidgetMeta, useWidgetPanelData } from '../utils';

export interface PageDesignerComponentPanelProps {
  interDatasources
  onUpdatedDatasource
  getDragItemConfig?: ComponentPanelProps['getDragItemConfig']
}

const itemRendererFac = (
  getDragItemConfig
): ItemRendererType => (widgetRef, groupType) => {
  // const widgetMeta = loadPlatformWidgetMeta(widgetRef);
  const [ready, widgetMeta] = useWidgetMeta(widgetRef);
  // console.log('widgetMeta :>> ', widgetMeta);
  if (!ready) return null;
  if (!widgetMeta) {
    return (
      <div className="t_red">widget 未定义</div>
    );
  }
  const {
    id, label
  } = widgetMeta;
  switch (groupType) {
    case 'dragableItems':
      return (
        <DragItemComp
          className="drag-comp-item"
          type={DragableItemTypes.DragableItemType}
          dragConfig={getDragItemConfig ? getDragItemConfig(widgetMeta) : {}}
          dragableWidgetType={{
            ...widgetMeta,
          }}
        >
          {label}
        </DragItemComp>
      );
    case 'dataSource':
      return (
        <div>dataSource</div>
      );
    default:
      return null;
  }
};

/**
 * page designer widget panel
 */
const PDWidgetPanel: React.FC<PageDesignerComponentPanelProps> = ({
  getDragItemConfig,
  interDatasources,
  onUpdatedDatasource,
  // widgetPanelData,
  ...other
}) => {
  const [ready, widgetPanelData] = useWidgetPanelData();
  if (!ready) {
    return (
      <LoadingTip />
    );
  }
  const { title: compPanelTitle, type: groupType, ...otherPanelConfig } = widgetPanelData;

  return (
    <div className="component-panel-container">
      <Tabs>
        <Tab label={compPanelTitle}>
          {/* <WidgetPanel
            {...other}
            componentPanelConfig={[widgetPanelData]}
            itemRenderer={itemRenderer}
          /> */}
          <GroupItemsRender
            groupType={groupType}
            itemRenderer={itemRendererFac(getDragItemConfig)}
            {...otherPanelConfig}
            // itemsGroups={widgetPanelData}
          />
        </Tab>
        <Tab label={(
          <DataSourceSelector
            interDatasources={interDatasources}
            onAddDataSource={(addData) => {
              // return console.log(addData);
              onUpdatedDatasource(addData);
            }}
          />
        )}
        >
          <DataSourceDragItem
            interDatasources={interDatasources}
          />
        </Tab>
        <Tab label="控件模版">
          <div>敬请期待</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PDWidgetPanel;
