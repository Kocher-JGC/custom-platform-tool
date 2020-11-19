import React from 'react';
import { Table } from 'antd';

export enum VarAttrTypeMap {
  string = '字符串',
  number = '数字',
  datasource = '数据源',
}

const takeVariableData = (varRely, options) => {
  const { flatLayoutItems } = options;
  const res = [];
  for (const varID in varRely) {
    if (Object.prototype.hasOwnProperty.call(varRely, varID)) {
      const variableItems = varRely[varID];
      const { type: varType, widgetRef, varAttr } = variableItems;
      /** 根据变量的类型决定取对应的引用数据的值 */
      switch (varType) {
        case 'widget':
          const widgetEntity = flatLayoutItems[widgetRef];
          if (widgetEntity) {
            const { propState } = widgetEntity;
            varAttr && varAttr.forEach((varItem) => {
              const { alias, attr, type } = varItem;
              const varCode = [widgetRef, attr].join('.');
  
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
          break;
        default:
          break;
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
        size="small"
        dataSource={takeVariableData(varRely, {
          flatLayoutItems
        })}
        rowKey="id"
      />
    </div>
  );
};
