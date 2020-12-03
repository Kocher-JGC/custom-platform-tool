import React from 'react';
import { PopModelSelector } from '@infra/ui';
import { PropItem, PropItemRenderContext } from '@platform-widget-access/spec';
import { EventSettingPanel } from './EventSettingPanel';
import './style.scss';
import { ActionsMeta } from '@engine/visual-editor/data-structure';
const whichAttr = 'eventRef';
export type EventsRef = {[key: string]: string[]}
export type InterAction = {label: string, value: string, key: string}
export type HandleCreate = (param1: {eventsRef: EventsRef}) => void;
export type EventConfig = {actList?: string[], condition?: any, stopByUser?: boolean}
export type HandleUpdate = (param1: {eventID: string, eventConfig: EventConfig}) => void;
export type HandleRemove = (param1: {eventID: string, eventsRef: EventsRef}) => void;
@PropItem({
  id: 'prop_action_config',
  name: 'PropActionConfig',
  label: '动作设置',
  whichAttr,
  useMeta: ['events'],
})
export class ActionHelperSpec {
  render(ctx: PropItemRenderContext) {
    const {
      editingWidgetState,
      changeEntityState,
      platformCtx: {
        meta: { takeMeta, changePageMeta }
      },
      widgetEntity
    } = ctx;
      /** 获取页面全部的动作列表 */
    const getInterActions = () => {
      const actions: {[key:string]: ActionsMeta} = takeMeta({
        metaAttr: 'actions',
      }) || {};
      if(!actions) return [];
      const actionList: InterAction[] = [];
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
    /** 
     * 新增事件，补充组件实例的事件映射列表
     */
    const handleCreate: HandleCreate = (param)=>{
      const { eventsRef } = param || {};
      changeEntityState({
        attr: whichAttr,
        value: eventsRef
      });
    };
      /**
     * 修改事件，更改 pageMetadata.events 中的事件配置数据
     */
    const handleUpdate: HandleUpdate = (param) => {
      const { eventID, eventConfig } = param || {};
      changePageMeta({
        metaAttr: 'events',
        type: 'update',
        data: eventConfig,
        metaID: eventID
      });
    };
    const handleRemove: HandleRemove = (param) => {
      const { eventsRef, eventID } = param || {};
      changePageMeta({
        metaAttr: 'events',
        type: 'rm',
        rmMetaID: eventID
      });
      changeEntityState({
        attr: whichAttr,
        value: eventsRef
      });
    };
    const handleSubmit = {
      'create/changePlace': handleCreate,
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
              );
            }
          }}
        >
          点击设置动作
        </PopModelSelector>
      </div>
    );
  }
}
