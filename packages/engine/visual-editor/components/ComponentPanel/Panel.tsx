import React from 'react';
import { Tabs, Tab } from '@infra/ui';

import DragItem, { DragItemConfig } from '@engine/visual-editor/spec/DragItem';
import { EditorComponentClass } from '@engine/visual-editor/types';
import { componentClassCollection } from '../../mock-data';
import { ItemTypes } from '../../spec/types';

export interface PanelItemsGroup {
  title: string
  items: string[]
}

export interface PanelTabGroupItem {
  title: string
  itemsGroups: PanelItemsGroup[]
}

export interface ComponentPanelConfig {
  tabGroup: PanelTabGroupItem[]
}

export interface ComponentPanelProps {
  /** 组件 panel 的配置 */
  componentPanelConfig: ComponentPanelConfig
  /** 可拖拽 item 的包装器 interface */
  itemWrapper?: (item: EditorComponentClass) => React.ReactChild
  /** 控制 DragItem 的 drag 配置的 interface，详情参考 react-dnd */
  getDragItemConfig?: (item: EditorComponentClass) => DragItemConfig
}

const ComponentPanel = ({
  componentPanelConfig,
  itemWrapper,
  getDragItemConfig
}: ComponentPanelProps) => {
  const { tabGroup } = componentPanelConfig;

  /**
   * 处理 Tabs 更改事件
   */
  const handleChange = () => {
    console.log('handleChange');
  };

  return (
    <div>
      <Tabs
        onChangeTab={handleChange}
      >
        {
          tabGroup.map((tg, idx) => {
            const {
              title: tgTitle,
              itemsGroups
            } = tg;
            return (
              <Tab label={tgTitle} key={idx}>
                {
                  itemsGroups.map((ig, _idx) => {
                    const {
                      title: igTitle,
                      items
                    } = ig;
                    return (
                      <div key={`${idx}_${_idx}`}>
                        <h5>{igTitle}</h5>
                        {
                          items.map((componentClassID, __idx) => {
                            const componentClass = componentClassCollection[componentClassID];
                            const {
                              id, label
                            } = componentClass;
                            return (
                              <div key={id}>
                                <DragItem
                                  type={ItemTypes.DragItemClass}
                                  dragConfig={getDragItemConfig ? getDragItemConfig(componentClass) : {}}
                                  dragItemClass={{
                                    ...componentClass,
                                  }}
                                >
                                  {
                                    typeof itemWrapper === 'function' ? itemWrapper(componentClass) : label
                                  }
                                </DragItem>
                              </div>
                            );
                          })
                        }
                      </div>
                    );
                  })
                }
              </Tab>
            );
          })
        }
      </Tabs>
    </div>
  );
};

ComponentPanel.defaultProps = {
  componentPanelConfig: {
    tabGroup: [
      {
        title: '控件类型',
        itemsGroups: [
          {
            title: '基础控件',
            items: [
              'component-1',
              'component-table-1',
            ]
          },
          {
            title: '布局',
            items: [
              'container-1'
            ]
          },
        ]
      },
    ]
  }
};

export default ComponentPanel;
