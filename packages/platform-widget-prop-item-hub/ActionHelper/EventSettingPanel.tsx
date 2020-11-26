import React, { useState, useEffect } from 'react';
import { Collapse, Form, Select, Input } from 'antd';
import { PlusSquareOutlined, DeleteOutlined, CaretRightOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
const { Panel } = Collapse;
interface ActionConfigItem {
  event: 'onClick'
  triggerAction: 'submit'
  preTrigger
  action
  condition
}

interface ActionConfigItemProps {
  config: ActionConfigItem
  onChange
  interDatasources: PD.Datasources
}

const DefaultActionSetting = {
  event: 'onClick',
  triggerAction: 'submit',
  preTrigger: '',
  action: '',
  condition: ''
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const EventConfigItem: React.FC<ActionConfigItemProps> = ({
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
        <Input />
      </Form.Item>
    </Form>
  );
};
export const EventPanelHeader: React.FC<{}> = ({
  title, onIconClick, Icon
}) => {
  return (
    <div className="flex">
      <span>{title}</span>
      <span className="flex"></span>
      <Icon
        className="mt-1"
        onClick={e=>{
          e.stopPropagation();
          onIconClick();
        }}
      />
    </div>
  );
};
export const EventRefRenderer: React.FC<{}> = ({
  refList, handleDelete, interActions, interEvents, handleUpdate
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
                Icon={DeleteOutlined}
                onIconClick={()=>{handleDelete(event);}}
                title={`事件${order+1}`}
              />
            )} key={event}
          >
            <EventConfigItem
              eventConfig = {interEvents[event] || {}}
              interActions={interActions}
              onUpdate = {(updateArea)=>{
                handleUpdate({
                  event, updateArea
                });
              }}
            />
          </Panel>
        ))
      }
    </Collapse>
  );
};
export const EventSettingPanel: React.FC<{}> = ({
  supportEvents,
  interActions,
  interEvents,
  defaultConfig,
  onSubmit
}) => {
  const [eventsRef, setEventsRef] = useState(defaultConfig);
  const [eventsConfig, setEventsConfig] = useState(interEvents);
  /** 新增事件，一般都是新增组件上的事件引用 */
  const handleCreate = (eventType) => {
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
      type: 'create',
      eventsRef: eventsRefInCreate
    });
  };

  /** 删除，需要删除 pageMetadata.events 的对应数据，以及组件实例上的事件引用 */
  const handleDelete = (eventType, eventID)=>{
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
      eventRef: eventRefInDelete,
      eventID
    });
  };

  /** 修改，需要修改 pageMetadata.events 的对应数据 */
  const handleUpdate = ({ event, updateArea }) => {
    const eventConfigInUpdate = {
      ...(eventsConfig[event] || {}),
      ...updateArea
    };    
    const eventsConfigInUpdate = {
      ...eventsConfig,
      [event]: eventConfigInUpdate
    };
    setEventsConfig(eventsConfigInUpdate);
    onSubmit({
      type: 'update',
      event, 
      eventConfig: eventConfigInUpdate
    });
  };
  return (
    <div className="event-setting-panel bg-gray-100 p-2">
      { supportEvents.length > 0 ? (
        <Collapse accordion className="support-events-panel">
          {supportEvents.map(supportEvent=>(
            <Panel
              header={(
                <EventPanelHeader 
                  Icon={PlusSquareOutlined}
                  onIconClick={()=>{handleCreate(supportEvent.type);}}
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
              />
            </Panel>
          ))}
        </Collapse>
      ) : null }
      
    </div>
  );
};
