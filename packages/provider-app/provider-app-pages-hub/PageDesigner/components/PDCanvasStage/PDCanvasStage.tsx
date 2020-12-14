import React from "react";
import CanvasStage from "@engine/visual-editor/components/CanvasStage";
// import Sortable from "sortablejs";
import { PDdragableItemOfStageWrapper } from "../PDdragableItemOfStageWrapper";
import { PDDragableItemTypes } from "../../const";

import "./index.less";

const PDCanvasStage = (props) => {
  // const { layoutNodeInfo } = props;
  // React.useEffect(() => {
  //   const canvasStage = document.querySelector(".canvas-stage");
  //   Sortable.create(canvasStage, {
  //     group: {
  //       name: "nested",
  //     },
  //     animation: 150,
  //     fallbackOnBody: true,
  //     swapThreshold: 0.65,
  //     onAdd(/** Event */ evt) {
  //       console.log(evt);
  //       // same properties as onEnd
  //       const nestableEle = document.querySelector(".canvas-stage .nestable");
  //       if (nestableEle) {
  //         console.log(nestableEle);
  //         Sortable.create(nestableEle, {
  //           group: {
  //             name: "nested",
  //           },
  //           animation: 150,
  //           fallbackOnBody: true,
  //           swapThreshold: 0.65,
  //           onAdd(/** Event */ evt) {
  //             console.log(evt);
  //             // same properties as onEnd
  //           },
  //         });
  //       }
  //     },
  //   });
  // }, [layoutNodeInfo]);
  return (
    <div style={{ height: "100%" }}>
      <CanvasStage
        dragableItemWrapper={PDdragableItemOfStageWrapper}
        triggerCondition={(dragItem) => {
          return dragItem && dragItem.type === PDDragableItemTypes.staticWidget;
        }}
        accept={[
          PDDragableItemTypes.containerWidget,
          PDDragableItemTypes.stageRealWidget,
          PDDragableItemTypes.staticWidget,
        ]}
        {...props}
      />
    </div>
  );
};

export default PDCanvasStage;
