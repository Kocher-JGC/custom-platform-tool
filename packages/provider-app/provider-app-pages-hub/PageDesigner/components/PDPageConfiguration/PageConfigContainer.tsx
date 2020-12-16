import React from "react";
import { Tabs, Tab } from "@infra/ui";
import { PageVariableSelector } from "./PageVariableSelector";
import { PageActionSelector } from "./PageActionSelector";
import { PageEventSelector } from "./PageEventSelector";
import { PageButtonSelector } from "./PageButtonSelector";
import { PageWidgetSelector } from "./PageWidgetSelector";
import "./style.scss";

export interface PageConfigContainerProps {
  flatLayoutItems;
  pageMetadata;
  platformCtx;
  pageState;
  changePageState;
}

export const PageConfigContainer: React.FC<PageConfigContainerProps> = (
  props
) => {
  return (
    <div className="page-config-container p-5 pt-0" id="pageConfigContainer">
      <Tabs>
        <Tab label="页面动作">
          <PageActionSelector {...props} />
        </Tab>
        <Tab label="页面变量">
          <PageVariableSelector {...props} />
        </Tab>
        <Tab label="页面事件">
          <PageEventSelector {...props} />
        </Tab>
        <Tab label="页面按钮">
          <PageButtonSelector {...props} />
        </Tab>
        <Tab label="页面控件">
          <PageWidgetSelector {...props} />
        </Tab>
      </Tabs>
    </div>
  );
};
