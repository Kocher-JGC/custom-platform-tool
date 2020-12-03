import React, { useState } from 'react';
import { Collapse, Form, Select, Input, Radio } from 'antd';
import { PlusSquareOutlined, DeleteOutlined, CaretRightOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { EventsRef, EventConfig, InterAction } from './spec';
const { Panel } = Collapse;


const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
};

export interface PEventConfigItem {
  eventConfig: InterEvent
  interActions: InterAction[]
  onUpdate: (param: {actList: string[]}) => void
}

/**
 * 单一事件项
 */
const EventConfigItem: React.FC<PEventConfigItem> = ({
  eventConfig,
  interActions,
  onUpdate
}) => {
  return (
    <Form 
      {...layout}
      className="card-item"
    >
      <Form.Item
        label="执行动作"
      >
        <Select 
          mode="multiple"
          allowClear
          options={interActions}
          value={eventConfig.actList || []}
          onChange={(value)=>{
            onUpdate({ 
              actList: value
            });
          }}
        />
      </Form.Item>
      <Form.Item
        label="执行条件"
      >
        <Input placeholder="暂不支持"/>
      </Form.Item>
      <Form.Item
        label="异常则中断执行"
      >
        <Radio.Group>
          <Radio value='1'>是</Radio>
          <Radio value='0'>否</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};
export interface PEventPanelHeader {
  title: string
  iconRenderer: () => React.ReactNode
  onHeaderClick?: (e)=>void
}
/**
 * 事件列表
 */
export const EventPanelHeader: React.FC<PEventPanelHeader> = ({
  title, iconRenderer, onHeaderClick
}) => {
  return (
    <div className="flex" onClick={e=>onHeaderClick && onHeaderClick(e)}>
      <span>{title}</span>
      <span className="flex"></span>
      {iconRenderer && iconRenderer()}
    </div>
  );
};
export interface PEventRefRenderer {
  refList: string[]
  handleDelete: (param: string) => void
  interActions: InterAction[]
  interEvents: InterEvents
  handleUpdate: HandleUpdate
  handleChangePlace: (eventID1: string, eventID2: string) => void
}
/**
 * 列表标题
 */
export const EventRefRenderer: React.FC<PEventRefRenderer> = ({
  refList, handleDelete, interActions, interEvents, handleUpdate, handleChangePlace
}) => {
  return (
    <Collapse 
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      className="event-list-panel" 
      ghost = {true}
    >
      {
        (refList || []).map((event, order)=>(
          <Panel
            header={(
              <EventPanelHeader 
                title={`事件${order+1}`}
                iconRenderer = {()=>{
                  return (
                    <>
                      {order > 0 ? (
                        <ArrowUpOutlined 
                          className="p-1"
                          onClick={(e)=>{
                            e.stopPropagation();
                            handleChangePlace(event, refList[order-1]); 
                          }}
                        />
                      ) : null }
                      {refList.length > 0 && order< refList.length -1 ? (
                        <ArrowDownOutlined 
                          className="p-1"
                          onClick={(e)=>{
                            e.stopPropagation();
                            handleChangePlace(event, refList[order+1]);
                          }}
                        />
                      ) : null}
                      <DeleteOutlined 
                        className="p-1"
                        onClick={(e)=>{
                          e.stopPropagation();
                          handleDelete(event);
                        }}
                      />
                    </>
                  );
                }}
              />
            )} key={event}
          >
            <EventConfigItem
              eventConfig = {interEvents[event] || {}}
              interActions={interActions}
              onUpdate = {(updateArea)=>{
                handleUpdate(event, updateArea);
              }}
            />
          </Panel>
        ))
      }
    </Collapse>
  );
};
export enum StopByError {yes, no}
export type ParamOnCreate = {type: 'create/changePlace', eventsRef: EventsRef}
export type ParamOnUpdate = {type: 'update', eventConfig: EventConfig, eventID: string}
export type ParamOnDelete = {type: 'remove', eventsRef: EventsRef, eventID: string}
export type InterEvent = {actList: string[], condition?: any, stopByError: StopByError}
export type InterEvents = {[key: string]: InterEvent}
export interface PEventSettingPanel {
  supportEvents: {alias: string, type: string}[]
  interActions: InterAction[]
  interEvents: InterEvents
  defaultConfig: {[key: string]: string[]}
  onSubmit: (param1: ParamOnCreate|ParamOnUpdate|ParamOnDelete) => void
}
export type HandleCreate = (eventType: string) => void
export type HandleDelete = (eventType: string, eventID: string) => void
export type HandleUpdate = (eventID: string, updateArea: EventConfig) => void
export type HandleChangePlace = (eventType: string, eventID1: string, eventID2: string) => void

/**
 * 事件编辑面板
 */
export const EventSettingPanel: React.FC<PEventSettingPanel> = ({
  supportEvents,
  interActions,
  interEvents,
  defaultConfig,
  onSubmit
}) => {
  const [eventsRef, setEventsRef] = useState(defaultConfig);
  const [eventsConfig, setEventsConfig] = useState(interEvents);
  const [activeKey, setActiveKey] = useState(supportEvents[0]?.type || '');
  /** 新增事件，一般都是新增组件上的事件引用 */
  const handleCreate: HandleCreate = (eventType) => {
    /** 创建事件唯一标识 */
    const getNewEventId = () => {
      return `event.${nanoid(8)}`;
    };
    const eventsRefInCreate = {
      ...eventsRef,
      [eventType]: [
        getNewEventId(),
        ...( eventsRef[eventType] || [])
      ]
    };
    setEventsRef(eventsRefInCreate);
    onSubmit({
      type: 'create/changePlace',
      eventsRef: eventsRefInCreate
    });
  };

  /** 删除，需要删除 pageMetadata.events 的对应数据，以及组件实例上的事件引用 */
  const handleDelete: HandleDelete = (eventType, eventID)=>{
    /** 1.删除组件实例上的事件引用 */
    const eventRefInDelete = {
      ...eventsRef,
      [eventType]: eventsRef[eventType].filter(item=>item!==eventID)
    };
    setEventsRef(eventRefInDelete);
    /** 2.删除 pageMetadata.events 的对应数据 */
    const { [eventID]: eventConfigInDelete, ...eventsConfigRest } = eventsConfig;
    setEventsConfig(eventsConfigRest);
    onSubmit({
      type: 'remove',
      eventsRef: eventRefInDelete,
      eventID
    });
  };

  /** 修改，需要修改 pageMetadata.events 的对应数据 */
  const handleUpdate: HandleUpdate = (eventID, updateArea) => {
    const eventConfigInUpdate = {
      ...(eventsConfig[eventID] || {}),
      ...updateArea
    };    
    const eventsConfigInUpdate = {
      ...eventsConfig,
      [eventID]: eventConfigInUpdate
    };
    setEventsConfig(eventsConfigInUpdate);
    onSubmit({
      type: 'update',
      eventID, 
      eventConfig: eventConfigInUpdate
    });
  };
  /** 更改事件位置 */
  const handleChangePlace: HandleChangePlace = (eventType, eventID1, eventID2) => {
    const eventsRefTmpl = eventsRef[eventType].slice();
    const index1 = eventsRefTmpl.findIndex((item)=>item === eventID1);
    const index2 = eventsRefTmpl.findIndex((item)=>item === eventID2);
    eventsRefTmpl.splice(index1,1,eventID2);
    eventsRefTmpl.splice(index2,1,eventID1);
    const eventsRefInChangePlace = {
      ...eventsRef,
      [eventType]: eventsRefTmpl
    };
    setEventsRef(eventsRefInChangePlace);
    onSubmit({
      type: 'create/changePlace',
      eventsRef: eventsRefInChangePlace
    });
  };
  return (
    <div className="event-setting-panel bg-gray-100 p-2">
      { supportEvents.length > 0 ? (
        <Collapse 
          activeKey = {activeKey}
          accordion 
          className="support-events-panel"
        >
          {supportEvents.map(supportEvent=>(
            <Panel
              header={(
                <EventPanelHeader 
                  onHeaderClick={()=>{
                    setActiveKey(supportEvent.type === activeKey ? '' : supportEvent.type);
                  }}
                  iconRenderer = {()=>{
                    return (
                      <PlusSquareOutlined 
                        className="mt-1"
                        onClick={(e)=>{
                          e.stopPropagation();
                          handleCreate(supportEvent.type);
                        }}
                      />
                    );
                  }}
                  title={supportEvent.alias}
                />
              )} key={supportEvent.type}
            >
              <EventRefRenderer 
                refList = {eventsRef[supportEvent.type]} 
                handleDelete = {(event)=>handleDelete(supportEvent.type, event)}
                interActions = {interActions}
                interEvents = {eventsConfig}
                handleUpdate = {handleUpdate}
                handleChangePlace = {(eventID1, eventID2)=>{
                  handleChangePlace(supportEvent.type, eventID1, eventID2);
                }}
              />
            </Panel>
          ))}
        </Collapse>
      ) : null }
      
    </div>
  );
};
