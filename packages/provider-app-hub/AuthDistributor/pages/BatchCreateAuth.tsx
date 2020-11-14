import React, { useState, useEffect } from 'react';
import { RightOutlined, CloseCircleOutlined } from '@ant-design/icons';

import {
  Divider, Radio, Space, Button, message
} from 'antd';
import AuthItemTree from '../components/AuthItemTree';
import AuthShowTree from '../components/AuthShowTree';
import {
  TEMINAL_TYPE, TERMINAL_TYPE_MENU, EXPAND_TYPE, MESSAGE
} from '../constants';
import { INode } from '../interface';

const BatchCreateAuth = (props) => {
  const {
    onSuccess, onCancel
  } = props;
  const [terminalType, setTerminalType] = useState(TEMINAL_TYPE.BS);
  const [AuthItemTreeRef, setAuthItemTreeRef] = useState<{reload?:()=>void}>({});
  const [AuthShowTreeRef, setAuthShowTreeRef] = useState<{reload?:()=>void}>({});
  const [checkedNodes, setCheckedNodes] = useState<INode[]>([]);
  const onFinish = () => {
    if (checkedNodes.length === 0) {
      message.warn(MESSAGE.NO_RECORD_TO_BATCH_CREATE);
      return;
    }
    const checkedKeys = checkedNodes.map((item) => item.uniqueId);
    checkedNodes.forEach((item) => {
      const { parentUniqueId } = item;
      if (parentUniqueId && !checkedKeys.includes(parentUniqueId)) {
        item.parentUniqueId = '';
      }
    });
    const showAuthorityList = checkedNodes
      .map((item) => {
        return {
          name: item.name, code: item.uniqueId, parentCode: item.parentUniqueId, authorityId: item.attachment?.authorityId, terminalType
        };
      });
    onSuccess({ showAuthorityList });
  };
  useEffect(() => {
    AuthItemTreeRef?.reload?.();
    AuthShowTreeRef?.reload?.();
    setCheckedNodes([]);
  }, [terminalType]);
  const handleTransfer = () => {
    if (checkedNodes.length === 0) return;
    const checkedNodesTmpl = JSON.parse(JSON.stringify(checkedNodes));
    checkedNodes.forEach((item) => item.disabled = true);
    AuthShowTreeRef?.onBatchAdd?.(checkedNodesTmpl);
    AuthItemTreeRef?.onUpdateCheckedNodes?.((node) => {
      node.disabled = true;
    });
  };
  const handleDelteShowItem = (nodes, keys) => {
    AuthItemTreeRef?.onUpdateCheckedNodes?.((node, key) => {
      if (keys.includes(key)) {
        node.disabled = false;
      }
    });
    AuthItemTreeRef?.onCancelCheckedKeys?.(keys);
    setCheckedNodes(checkedNodes.filter((item) => !keys.includes(item.uniqueId)));
  };
  return (
    <>
      <div className="flex">
        <div className="auth-item-tree flex-1 rounded border border-solid border-gray-400 p-3" style={{ height: 300 }}>
          <AuthItemTree
            onRef = {(AuthItemTreeRefTmpl) => {
              setAuthItemTreeRef(AuthItemTreeRefTmpl);
            }}
            expandType = {EXPAND_TYPE.EXPAND_ALL}
            height={220}
            searchParams = {{ terminalType }}
            onSelect = {(selectedKeys, selectedNames, selectedNodes) => {
              selectedNodes = selectedNodes.filter((item) => !item.attachment?.binding);
              setCheckedNodes(selectedNodes);
            }}
            checked
            checkable = {true}
          />
        </div>
        <div
          className="rounded border-solid border-gray-500 border w-8 h-8 cursor-pointer ml-5 mr-5"
          style={{ marginTop: 130 }}
          onClick={handleTransfer}
        >
          <RightOutlined className="ml-2" />
        </div>
        <div className="show-auth-tree flex-1 rounded border-solid border border-gray-400 p-3" style={{ height: 300 }}>
          <AuthShowTree
            onRef = {(AuthShowTreeRefTmpl) => {
              setAuthShowTreeRef(AuthShowTreeRefTmpl);
            }}
            expandType = {EXPAND_TYPE.EXPAND_ALL}
            height={220}
            searchParams = {{ terminalType, excludeTerminalData: true }}
            onSelect = {(selectedKeys, selectedNames, selectedNodes) => {
            // setAuthParent({ id: selectedKeys[0], name: selectedNames[0] });
            }}
            onDeleteNode = {handleDelteShowItem}
            canIDeleteNode = {(node) => {
              return node.attachment?.authorityId;
            }}
          />
        </div>
      </div>
      <Divider />
      请选择所属终端：<Radio.Group
        options = {TERMINAL_TYPE_MENU}
        value = {terminalType}
        onChange = {(e) => {
          const { value } = e.target;
          setTerminalType(value);
        }}
      ></Radio.Group>
      <div className="clearfix">
        <Space className="float-right">
          <Button type="primary" onClick={onFinish}>
            确定
          </Button>
          <Button htmlType="button" onClick={onCancel}>
            取消
          </Button>
        </Space>
      </div>
    </>
  );
};
export default React.memo(BatchCreateAuth);
