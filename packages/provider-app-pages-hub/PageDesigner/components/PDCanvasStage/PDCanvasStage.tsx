import React from "react";
import CanvasStage from "@engine/visual-editor/components/CanvasStage";
import { PDdragableItemOfStageWrapper } from "../PDdragableItemOfStageWrapper";

const PDCanvasStage = (props) => {
  return (
    <div style={{ height: "100%" }}>
      <CanvasStage
        dragableItemWrapper={PDdragableItemOfStageWrapper}
        {...props}
      />
    </div>
  );
};

export default PDCanvasStage;
