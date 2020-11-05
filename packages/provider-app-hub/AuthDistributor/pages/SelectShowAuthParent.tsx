import React, { useState } from 'react';
import {
  Button, Space
} from 'antd';
import { AuthShowTree } from '../components/AuthShowTree';

interface IOnSuccessParams {
  id:string;
  name:string
}

interface IProps {
  onSuccess:(item: IOnSuccessParams) => void;
  onCancel: ()=>void;
}

export const SelectShowAuthParent = ({
  onSuccess, onCancel
}: IProps) => {
  const [authParent, setAuthParent] = useState<IOnSuccessParams>({ id: '', name: '' });
  return (
    <>
      <div style={{ minHeight: 300 }}>
        <AuthShowTree
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
