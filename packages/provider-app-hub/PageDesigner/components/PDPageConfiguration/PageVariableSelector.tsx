import React from 'react';
import { Table } from 'antd';

export enum VarAttrTypeMap {
  string = '字符串',
  number = '数字',
  datasource = '数据源',
}

const takeVariableData = (varRely, flatLayoutItems) => {
  const res = [];
  for (const widgetID in varRely) {
    if (Object.prototype.hasOwnProperty.call(varRely, widgetID)) {
      const variableItems = varRely[widgetID];
      const widgetEntity = flatLayoutItems[widgetID];
      if (widgetEntity) {
        const { propState } = widgetEntity;
        variableItems.forEach((varItem) => {
          const { alias, attr, type } = varItem;
          const varCode = `${widgetID}.${attr}`;

          // TODO: 这里取了特定的值，后续需要改进
          const { widgetCode, title } = propState;

          if (!propState) return;

          res.push({
            varCode: widgetCode,
            varType: VarAttrTypeMap[type],
            varDesc: `${title}.${alias}`,
            id: varCode,
          });
        });
      }
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
