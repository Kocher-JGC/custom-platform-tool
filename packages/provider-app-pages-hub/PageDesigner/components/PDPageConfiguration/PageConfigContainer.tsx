import React, { useRef } from 'react';
import { Tabs, Tab, Button } from '@infra/ui';
import { PageVariableSelector } from './PageVariableSelector';
import { PageActionSelector } from './PageActionSelector';

export interface PageConfigContainerProps {
  flatLayoutItems
  pageMetadata
  ChangeMetadata
}

export const PageConfigContainer: React.FC<PageConfigContainerProps> = (props) => {
  const actionSelectorRef = useRef();
  const handleOk = async () => {
    const { valid: actionValid, actions } = actionSelectorRef.current?.onSubmitData?.() || {};
    if([actionValid].includes('invalid')) return;
    props.ChangeMetadata({
      metaAttr: 'actions',
      data: actions,
      replace: true
    });
  };
  const handleCancel = () => {
    
  };
  return (
    <div className="page-config-container p-5 pt-0">
      <Tabs>
        <Tab label="页面动作">
          <PageActionSelector 
            ref = {actionSelectorRef}
            {...props}
          />
        </Tab>
        <Tab label="页面变量">
          <PageVariableSelector {...props} />
        </Tab>
      </Tabs>
      <div className="clear-both mt-2" style={{ height: '30px' }}>
        <Button
          className="float-right"
          size="sm"
          onClick={handleCancel}
        >
          取消
        </Button>
        <Button
          className="float-right mr-2"
          onClick={handleOk}
          size="sm"
          type="primary"
        >
          确定
        </Button>
      </div>
    </div>
  );
};
