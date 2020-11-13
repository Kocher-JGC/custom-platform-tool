import React from 'react';
import { Tabs, Tab } from '@infra/ui';
import { PageVariableSelector } from './PageVariableSelector';

export interface PageConfigContainerProps {
  flatLayoutItems
  pageMetadata
}

export const PageConfigContainer: React.FC<PageConfigContainerProps> = (props) => {
  return (
    <div className="page-config-container">
      <Tabs>
        <Tab label="页面变量">
          <PageVariableSelector {...props} />
        </Tab>
      </Tabs>
    </div>
  );
};
