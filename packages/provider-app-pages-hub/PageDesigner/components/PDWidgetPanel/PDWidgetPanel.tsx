/**
 * 左边的组件面板
 */

import React from "react";
import { ComponentPanelProps } from "@engine/visual-editor/components/WidgetPanel";
import DragItemComp from "@engine/visual-editor/spec/DragItemComp";
import { Tab, Tabs } from "@infra/ui";
import {
  GroupItemsRender,
  ItemRendererType,
} from "@engine/visual-editor/components/GroupPanel";
import { LoadingTip } from "@provider-ui/loading-tip";
import { PageMetadata } from "@engine/visual-editor/data-structure";
import { getWidgetMetadata } from "@platform-widget-access/loader";

import { DataSourceDragItem } from "../PDDataSource";
import { useWidgetMeta, useWidgetPanelData } from "../../utils";
import { DataSourceTitle } from "./DataSourceTitle";
import { groupWidget } from "./group-shape";
import { PDDragableItemTypes } from "../../const";

export interface PageDesignerComponentPanelProps {
  pageMetadata: PageMetadata;
  onUpdatedDatasource;
  getDragItemConfig?: ComponentPanelProps["getDragItemConfig"];
}

/**
 * 左边组件面板的组件工厂函数
 * @param getDragItemConfig
 */
const itemRendererFac = (getDragItemConfig): ItemRendererType => (
  widgetRef,
  groupType
) => {
  const [ready, widgetMeta] = useWidgetMeta(widgetRef);
  if (!ready) return null;
  if (!widgetMeta) {
    return <div className="t_red">widget 未定义</div>;
  }
  const { label } = widgetMeta;
  switch (groupType) {
    case "dragableItems":
      return (
        <DragItemComp
          id={widgetRef}
          accept={[]}
          className="drag-comp-item"
          type={PDDragableItemTypes.staticWidget}
          dragConfig={getDragItemConfig ? getDragItemConfig(widgetMeta) : {}}
          dragableWidgetType={{
            ...widgetMeta,
          }}
        >
          {label}
        </DragItemComp>
      );
    case "dataSource":
      return <div>dataSource</div>;
    default:
      return null;
  }
};

/**
 * page designer widget panel
 */
const PDWidgetPanel: React.FC<PageDesignerComponentPanelProps> = ({
  getDragItemConfig,
  pageMetadata,
  onUpdatedDatasource,
  // widgetPanelData,
  ...other
}) => {
  // const [widgetPanelData, setWidgetPanelData] = React.useState(null);
  // React.useEffect(() => {
  //   getWidgetMetadata().then((res) => {
  //     const widgetGroupingData = groupWidget(res);
  //     // console.log(res);
  //     setWidgetPanelData(widgetGroupingData);
  //   });
  // }, []);
  const [ready, widgetPanelData] = useWidgetPanelData();
  if (!ready) {
    return <LoadingTip />;
  }
  const {
    title: compPanelTitle,
    type: groupType,
    ...otherPanelConfig
  } = widgetPanelData;
  // const interDatasources = [];
  const interDatasources = Object.values(pageMetadata?.dataSource);

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
        <Tab
          label={
            <DataSourceTitle
              interDatasources={interDatasources}
              onAddDataSource={(addData) => {
                // return console.log(addData);
                onUpdatedDatasource(addData);
              }}
            />
          }
        >
          <DataSourceDragItem interDatasources={interDatasources} />
        </Tab>
        <Tab label="控件模版">
          <div>敬请期待</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PDWidgetPanel;
