import React from 'react';
import { Tabs, Tab } from '@infra/ui';
import { PageVariableSelector } from './PageVariableSelector';
import { PageActionSelector } from './PageActionSelector';
import { PageEventSelector } from './PageEventSelector';

export interface PageConfigContainerProps {
  flatLayoutItems
  pageMetadata
  platformCtx
  pageState
  changePageState
}

export const PageConfigContainer: React.FC<PageConfigContainerProps> = (props) => {
  return (
    <div className="page-config-container p-5 pt-0">
      <Tabs>
        <Tab label="页面动作">
          <PageActionSelector 
            {...props}
          />
        </Tab>
        <Tab label="页面变量">
          <PageVariableSelector
            {...props}
          />
        </Tab>
        <Tab label="页面事件">
          <PageEventSelector
            {...props}
          />
        </Tab>

      </Tabs>
    </div>
  );
};
