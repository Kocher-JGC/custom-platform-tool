/**
 * 左边的组件面板
 */

import React from "react";
import DragItemComp from "@engine/visual-editor/spec/DragItemComp";
import { Tab, Tabs } from "@infra/ui";
import {
  GroupItemsRender,
  ItemRendererType,
} from "@engine/visual-editor/components/GroupPanel";
import { LoadingTip } from "@provider-ui/loading-tip";
import { PageMetadata } from "@engine/visual-editor/data-structure";
import { getWidgetMetadata } from "@platform-widget-access/loader";
// import Sortable from "sortablejs";

import { DataSourceDragItem } from "../PDDataSource";
import { useWidgetMeta, useWidgetPanelData } from "../../utils";
import { DataSourceTitle } from "./DataSourceTitle";
import { groupWidget } from "./group-shape";
import { PDDragableItemTypes } from "../../const";

export interface PageDesignerComponentPanelProps {
  pageMetadata: PageMetadata;
  onUpdatedDatasource;
}

/**
 * 左边组件面板的组件工厂函数
 */
const itemRendererFac = (): ItemRendererType => (widgetRef, groupType) => {
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
          sortable={false}
          accept={[]}
          className="drag-comp-item"
          type={PDDragableItemTypes.staticWidget}
          dragableWidgetType={{
            ...widgetMeta,
          }}
        >
          {label}
        </DragItemComp>
        // <div
        //   id={widgetRef}
        //   // accept={[]}
        //   className="drag-comp-item"
        //   // type={PDDragableItemTypes.staticWidget}
        //   // dragableWidgetType={{
        //   //   ...widgetMeta,
        //   // }}
        // >
        //   {label}
        // </div>
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
  // React.useEffect(() => {
  //   if (!ready) return;
  //   setTimeout(() => {
  //     const dragCompItem = document.querySelectorAll(".items-content");
  //     dragCompItem.forEach((item) => {
  //       Sortable.create(item, {
  //         group: {
  //           name: "nested",
  //           pull: "clone",
  //           put: false,
  //         },
  //         sort: false,
  //         // draggable: ".drag-comp-item",
  //         animation: 150,
  //         fallbackOnBody: true,
  //         swapThreshold: 0.65,
  //         setData(/** DataTransfer */ dataTransfer, /** HTMLElement */ dragEl) {
  //           dataTransfer.setData("Text", "123"); // `dataTransfer` object of HTML5 DragEvent
  //         },
  //       });
  //     });
  //   }, 100);
  // }, [ready]);
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
            itemClasses="nestable"
            groupType={groupType}
            itemRenderer={itemRendererFac()}
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
