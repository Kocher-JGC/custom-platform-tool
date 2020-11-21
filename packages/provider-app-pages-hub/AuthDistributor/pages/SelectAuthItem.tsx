import React, { useState } from 'react';
import {
  Button, Space
} from 'antd';
import AuthItemTree from '../components/AuthItemTree';
import { EXPAND_TYPE } from '../constants';

interface IOnSuccessParams {
  id:string;
  name:string
}

interface IProps {
  onSuccess:(item: IOnSuccessParams) => void;
  onCancel: ()=>void;
  authItems?: string[]
  searchParams: {[key:string]: any}
}

/**
 * 权限项选择组件
 * @param param0
 */
const SelectAuthItem = ({
  onSuccess, onCancel, authItems, searchParams
}: IProps) => {
  const [authParent, setAuthParent] = useState<IOnSuccessParams>({ id: '', name: '' });
  return (
    <>
      <div style={{ minHeight: 300 }}>
        <AuthItemTree
          expandType = {EXPAND_TYPE.EXPAND_VALUES}
          searchParams = {searchParams}
          authItems = {authItems}
          onSelect = {(selectedKeys, selectedNames) => {
            setAuthParent({ id: selectedKeys[0], name: selectedNames[0] });
          }}
          selectable = {true}
        />
      </div>
      <Space className="float-right">
        <Button
          type="primary" onClick={() => {
            onSuccess(authParent);
          }}
        >
            确定
        </Button>
        <Button htmlType="button" onClick={onCancel}>
            取消
        </Button>
      </Space>
    </>
  );
};
export default React.memo(SelectAuthItem);