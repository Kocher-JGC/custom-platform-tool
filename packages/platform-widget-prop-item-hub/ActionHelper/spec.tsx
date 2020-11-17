import React from 'react';
import { PopModelSelector } from '@infra/ui';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { ActionSettingPanel } from './ActionSettingPanel';

const whichAttr = 'actionRef';

@PropItem({
  id: 'prop_action_config',
  name: 'PropActionConfig',
  label: '动作设置',
  whichAttr,
  useMeta: ['actions'],
})
export class ActionHelperSpec {
  render(ctx: PropItemRenderContext) {
    const {
      takeMeta, genMetaRefID, changeEntityState, changeMetadata,
      editingWidgetState
    } = ctx;
    const metaRefID = editingWidgetState[whichAttr];
    const actionConfig = metaRefID ? takeMeta({
      metaAttr: 'actions',
      metaRefID
    }) : undefined;
    const datasource = takeMeta({
      metaAttr: 'dataSource',
    });
    const interDatasources = Object.values(datasource);

    return (
      <div>
        <PopModelSelector
          modelSetting={{
            title: '设置动作',
            width: 500,
            position: 'right',
            type: 'side',
            children: ({ close }) => {
              return (
                <ActionSettingPanel
                  interDatasources={interDatasources}
                  defaultConfig={actionConfig}
                  onSubmit={(actionSetting) => {
                    const nextMetaID = genMetaRefID(`a`);
                    changeEntityState({
                      attr: whichAttr,
                      value: nextMetaID
                    });
                    changeMetadata({
                      data: actionSetting,
                      metaAttr: 'actions',
                      metaID: nextMetaID
                    });
                    close();
                  }}
                />
              );
            }
          }}
        >
          设置点击动作
        </PopModelSelector>
      </div>
    );
  }
}
