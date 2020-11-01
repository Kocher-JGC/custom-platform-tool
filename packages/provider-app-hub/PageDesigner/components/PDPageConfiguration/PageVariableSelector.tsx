import React from 'react';
import { Table } from 'antd';

const takeVariableData = (variable, flatLayoutItems) => {
  const res = [];
  for (const widgetID in variable) {
    if (Object.prototype.hasOwnProperty.call(variable, widgetID)) {
      const variableItems = variable[widgetID];
      const widgetEntity = flatLayoutItems[widgetID];
      console.log('widgetEntity :>> ', widgetEntity);
      variableItems.forEach((varItem) => {
        const varCode = `${widgetID}.${varItem}`;
        res.push({
          varCode,
          varType: '字符串',
          varDesc: widgetEntity.propState?.title + widgetEntity.propState[varItem],
          id: varCode,
        });
      });
    }
  }
  return res;
};

export const PageVariableSelector = ({
  flatLayoutItems,
  pageMetadata
}) => {
  const { variable } = pageMetadata;
  // console.log('variable :>> ', variable);
  // console.log('flatLayoutItems :>> ', flatLayoutItems);
  return (
    <div className="page-var-selector">
      <Table
        columns={[
          {
            dataIndex: 'varCode',
            title: '变量编码'
          },
          {
            dataIndex: 'varType',
            title: '类型'
          },
          {
            dataIndex: 'varDesc',
            title: '描述'
          },
          {
            dataIndex: 'action',
            title: '操作',
            render: () => {
              return (
                <span>删除</span>
              );
            }
          },
        ]}
        dataSource={takeVariableData(variable, flatLayoutItems)}
        rowKey="id"
      />
    </div>
  );
};
