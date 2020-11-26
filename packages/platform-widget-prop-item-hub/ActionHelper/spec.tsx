import React, { useState } from 'react';
import { PopModelSelector } from '@infra/ui';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { EventSettingPanel } from './EventSettingPanel';
import './style.scss';
const whichAttr = 'eventRef';

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
      changeEntityState, 
      editingWidgetState,
      platformCtx: {
        meta: { takeMeta, changePageMeta }
      },
      widgetEntity
    } = ctx;
    console.log(ctx);
    /** 获取页面全部的动作列表 */
    const getInterActions = () => {
      const actions = takeMeta({
        metaAttr: 'actions',
      });
      if(!actions) return [];
      const actionList = [];
      for(const key in actions){
        const { [key]: { name: label } } = actions;
        actionList.push({
          label, value: key, key
        });
      }
      return actionList;
    };
    /** 获取页面全部的事件列表 */
    const interEvents = takeMeta({
      metaAttr: 'events',
    }) || {};
    /** 组件所支持的事件列表 */
    const supportEvents = widgetEntity.eventAttr || [];
    const handleCreate = (param)=>{
      const { eventsRef } = param || {};
      changeEntityState({
        attr: whichAttr,
        value: eventsRef
      });
    };
    const handleUpdate = (param) => {
      const { event, eventConfig } = param || {};
      changePageMeta({
        metaAttr: 'events',
        type: 'update',
        data: eventConfig,
        metaID: event
      });
    };
    const handleRemove = (param) => {
      const { eventRef, eventID } = param || {};
      changePageMeta({
        metaAttr: 'events',
        type: 'rm',
        rmMetaID: eventID
      });
      changeEntityState({
        attr: whichAttr,
        value: eventRef
      });
    };
    const handleSubmit = {
      'create': handleCreate,
      'update': handleUpdate,
      'remove': handleRemove
    };
    return (
      <div>
        <PopModelSelector
          modelSetting={{
            title: '设置动作',
            width: 350,
            position: 'right',
            type: 'side',
            maxHeightable: false,
            style:{ maxHeight: '100vh' },
            children: ({ close }) => {
              return React.useMemo(()=>{
                return (
                  <EventSettingPanel
                    supportEvents = {supportEvents}
                    interActions={getInterActions()}
                    interEvents={interEvents}
                    defaultConfig={editingWidgetState[whichAttr] || {}}
                    onSubmit={(eventSetting) => {
                      const { type, ...rest } = eventSetting;
                      handleSubmit[type](rest);
                    }}
                  />
                );}, [interEvents, editingWidgetState[whichAttr]]);
            }
          }}
        >
          点击设置动作
        </PopModelSelector>
      </div>
    );
  }
}
