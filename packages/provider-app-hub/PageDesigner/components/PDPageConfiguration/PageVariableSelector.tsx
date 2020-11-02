import React from 'react';
import { Table } from 'antd';

const takeVariableData = (varRely, flatLayoutItems) => {
  const res = [];
  for (const widgetID in varRely) {
    if (Object.prototype.hasOwnProperty.call(varRely, widgetID)) {
      const variableItems = varRely[widgetID];
      const widgetEntity = flatLayoutItems[widgetID];
      console.log('widgetEntity :>> ', widgetEntity);
      const { propState } = widgetEntity;
      variableItems.forEach((varItem) => {
        const varCode = `${widgetID}.${varItem}`;
        res.push({
          varCode: propState[varItem],
          varType: '字符串',
          varDesc: propState.title,
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
  const { varRely } = pageMetadata;
  // console.log('varRely :>> ', varRely);
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
        dataSource={takeVariableData(varRely, flatLayoutItems)}
        rowKey="id"
      />
    </div>
  );
};
