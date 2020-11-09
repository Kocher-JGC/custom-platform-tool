import React, { useState } from 'react';
import {
  Button, Space
} from 'antd';
import AuthShowTree from '../components/AuthShowTree';
import { EXPAND_TYPE } from '../constants';

interface IOnSuccessParams {
  id:string;
  name:string
}

interface IProps {
  onSuccess:(item: IOnSuccessParams) => void;
  onCancel: ()=>void;
  showAuthItems?: string[]
  searchParams: {[key: string]: any}
}

/**
 * 权限展示组件
 * @param param0
 */
const SelectShowAuth = ({
  onSuccess, onCancel, showAuthItems, searchParams
}: IProps) => {
  const [showAuth, setShowAuth] = useState<IOnSuccessParams>({ id: '', name: '' });
  return (
    <>
      <div style={{ minHeight: 300 }}>
        <AuthShowTree
          expandType = {EXPAND_TYPE.EXPAND_VALUES}
          searchParams = {searchParams}
          showAuthItems = {showAuthItems}
          onSelect = {(selectedKeys, selectedNames) => {
            setShowAuth({ id: selectedKeys[0], name: selectedNames[0] });
          }}
          selectable = {true}
        />
      </div>
      <Space className="float-right">
        <Button
          type="primary" onClick={() => {
            onSuccess(showAuth);
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
export default React.memo(SelectShowAuth);
