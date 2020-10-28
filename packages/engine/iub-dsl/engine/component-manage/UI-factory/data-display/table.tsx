import React, { useMemo, useContext } from 'react';
import { Table as NormalTable, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
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

const dataSorce = [
  {
    id: '0',
    address: '地址0',
    username: '用户0'
  },
  {
    id: '1',
    address: '地址1',
    username: '用户1'
  },
  {
    id: '2',
    address: '地址2',
    username: '用户2'
  },
  {
    id: '3',
    address: '地址3',
    username: '用户3'
  },
];

export const normalTablePropsKes = Object.keys(normalTablePropsMapList);

const pickBaseInputPropsKey = basePickPropsCstr(normalTablePropsKes);

const normalTablePropsMap = basePropsMapCstr<any>(normalTablePropsMapList);

export const normalTableCompName = AllUI.NormalTable;

const TableFactory = ({
  id, columns, children, ...ohterProps
}) => {
  /** 下面三步确保props全部正确可用 */
  const allPropsKey = Object.keys(ohterProps);
  const canUsePropsKey = pickBaseInputPropsKey(allPropsKey);
  const actualProps = normalTablePropsMap(ohterProps, canUsePropsKey);
  console.log(actualProps);
  const context = useContext(DefaultCtx);

  const actualCoumns = useMemo(() => {
    console.log(columns);
    columns.push({
      render: (text: string, record, index: number) => {
        console.log(text, record, index);
        return (<>
          <Button
            onClick={() => {
              const { asyncDispatchOfIUBEngine } = context.runTimeCtxToBusiness.current;
              const action = antTableRowClick()(text, record, index);
              // context.runTimeCtxToBusiness.current.action = action;
              // asyncDispatchOfIUBEngine({
              //   type: 'flowsRun',
              //   params: [['updFlow_1'], context.runTimeCtxToBusiness.current],
              //   //  schedulerAction
              //   action: {
              //     type: 'effectReceiver'
              //   }
              // });
              // text, record, index
              // asyncDispatchOfIUBEngine()
            }}
          >修改</Button>&nbsp;&nbsp;
          <Button>详情</Button>
        </>);
      }
    });
    return columns;
  }, [columns]);
  /**
   * 必要的断言
   */
  assertPropsKey(id, allPropsKey, canUsePropsKey);
  return (
    <NormalTable
      columns={actualCoumns}
      rowKey='id'
      // dataSource={dataSorce}
      {...actualProps}
    />
  );
};

export {
  TableFactory
};
