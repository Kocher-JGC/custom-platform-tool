import React, { useMemo, useContext } from 'react';
import { Table as NormalTable, Button, Popconfirm } from 'antd';
import { basePickPropsCstr, basePropsMapCstr, assertPropsKey } from '../utils';
import { AllUI } from '../types';
import { DefaultCtx } from '../../../runtime';
import { antTableRowClick } from '../../../event-manage/onClick-event';

/**
 * IUB-DSL组件描述上的A属性由真实组件的B属性实现
 */
export const normalTablePropsMapList = {
  columns: 'columns',
  dataSource: 'dataSource'
};

// const dataSource = [
//   {
//     id: '0',
//     address: '地址0',
//     username: '用户0',
//     description: 'description1223'
//   },
//   {
//     id: '1',
//     address: '地址1',
//     username: '用户1',
//     description: 'description124'
//   },
//   {
//     id: '2',
//     address: '地址2',
//     username: '用户2',
//     description: 'descriptifgdjklon124'
//   },
//   {
//     id: '3',
//     address: '地址3',
//     username: '用户3',
//     description: 'description12'
//   },
// ];

export const normalTablePropsKes = Object.keys(normalTablePropsMapList);

const pickBaseInputPropsKey = basePickPropsCstr(normalTablePropsKes);

const normalTablePropsMap = basePropsMapCstr<any>(normalTablePropsMapList);

export const normalTableCompName = AllUI.NormalTable;
/**
 * 1. metadata
 * 2. PK
 * 3. colKey 「index」 /rowKey 「dataIndex」
 * 4. colData / rowData
 * 5. dataSource
 * 6. gridData
 * 7. recordTotal /pageSize/currentPage
 */

const TableFactory = ({
  id, columns, children, compMark,
  dataSource, pageUrl,
  compInfo, ...ohterProps
}) => {
  // PK、dataSource、metadata

  const allPropsKey = Object.keys(ohterProps);
  const canUsePropsKey = pickBaseInputPropsKey(allPropsKey);
  const actualProps = normalTablePropsMap(ohterProps, canUsePropsKey);
  // console.log(actualProps);
  const context = useContext(DefaultCtx);

  const actualCoumns = useMemo(() => {
    // @(schemas).1321031025329053696
    columns.push({
      render: (gridData: string, rowData, colKey: number) => {
        // rowKey 「dataIndex」 、 colData
        return (<>
          <Button
            onClick={() => {
              const { asyncDispatchOfIUBEngine } = context.runTimeCtxToBusiness.current;
              const action = antTableRowClick(compInfo)({
                pageUrl,
                gridData,
                rowData,
                colKey,
                dataSource,
                pageStatus: 'updateStatus' // TODO 应该也是配置
              });
              context.runTimeCtxToBusiness.current.action = action;
              asyncDispatchOfIUBEngine({
                dispatch: {
                  module: 'flowManage',
                  method: 'flowsRun',
                  isInjectCtx: true,
                  params: [['updFlow_1']],
                },
                actionInfo: {
                  actionType: 'effectReceiver'
                }
              });
            }}
          >修改</Button>&nbsp;&nbsp;
          <Button
            onClick={() => {
              const { asyncDispatchOfIUBEngine } = context.runTimeCtxToBusiness.current;
              const action = antTableRowClick(compInfo)({
                pageUrl,
                gridData,
                rowData,
                colKey,
                dataSource,
                pageStatus: 'detailStatus' // TODO 应该也是配置
              });
              context.runTimeCtxToBusiness.current.action = action;
              asyncDispatchOfIUBEngine({
                dispatch: {
                  module: 'flowManage',
                  method: 'flowsRun',
                  isInjectCtx: true,
                  params: [['updFlow_1']],
                },
                actionInfo: {
                  actionType: 'effectReceiver'
                }
              });
            }}
          >详情</Button>&nbsp;&nbsp;
          <Popconfirm
            title="删除" onConfirm={() => {
              const { asyncDispatchOfIUBEngine } = context.runTimeCtxToBusiness.current;
              const action = antTableRowClick(compInfo)({
                gridData, rowData, colKey, dataSource, pageStatus: 'detailStatus' // TODO 应该也是配置
              });
              context.runTimeCtxToBusiness.current.action = action;
              asyncDispatchOfIUBEngine({
                dispatch: {
                  module: 'flowManage',
                  method: 'flowsRun',
                  isInjectCtx: true,
                  params: [['delFlow_1']],
                },
                actionInfo: {
                  actionType: 'effectReceiver'
                }
              });
            }}
          >
            <Button >删除</Button>
          </Popconfirm>

        </>);
      }
    });
    return columns;
  }, []);

  /**
   * 必要的断言
   */
  assertPropsKey(id, allPropsKey, canUsePropsKey);
  return (
    <NormalTable
      columns={actualCoumns}
      rowKey='id'
      // dataSource={dataSource}
      dataSource={dataSource?.data}
      // {...actualProps}
    />
  );
};

export {
  TableFactory
};
