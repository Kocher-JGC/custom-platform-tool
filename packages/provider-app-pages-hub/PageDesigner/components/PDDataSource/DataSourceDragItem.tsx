import React from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

interface DataSourceDragItemProps {
  /** 内部的数据源格式 */
  interDatasources: PD.Datasources
}

/**
 * 根据 columns 包装可以拖拽的元素
 */
export const DataSourceDragItem: React.FC<DataSourceDragItemProps> = ({
  interDatasources
}) => {
  return (
    <div className="data-source-drag-items">
      <Collapse ghost>
        {
          Array.isArray(interDatasources) && interDatasources.map((datasourceItem) => {
            const { name: dName, columns, id } = datasourceItem;
            return (
              <Panel header={dName} key={id}>
                <div className="group p-2">
                  {
                    (columns ? Object.values(columns) : []).map((column) => {
                      const { name: colName, id } = column;
                      return (
                        <p key={id}>{colName}</p>
                      );
                    })
                  }
                </div>
              </Panel>
            );
          })
        }
      </Collapse>
    </div>
  );
};
