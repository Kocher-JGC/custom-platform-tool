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

/**
 * 批量新增权限展示数据
 * @param props
 */
const BatchCreateAuth = (props) => {
  const {
    onSuccess, onCancel
  } = props;
  const [terminalType, setTerminalType] = useState(TEMINAL_TYPE.BS);
  const [AuthItemTreeRef, setAuthItemTreeRef] = useState<{reload?:()=>Promise<void>}>({});
  const [AuthShowTreeRef, setAuthShowTreeRef] = useState<{reload?:()=>Promise<void>}>({});
  const [checkedAuthItems, setCheckedAuthItem] = useState<INode[]>([]);
  const [checkedShowAuths, setCheckedShowAuths] = useState<INode>();
  const onFinish = () => {
    const originalList = AuthShowTreeRef?.onGetData()?.originalList || [];
    const showAuthSaving = originalList.filter((item) => item.canBeDeleted);
    if (showAuthSaving.length === 0) {
      message.warn(MESSAGE.NO_RECORD_TO_BATCH_CREATE);
      return;
    }
    const checkedKeys = originalList.map((item) => item.uniqueId);
    showAuthSaving.forEach((item) => {
      const { parentUniqueId } = item;
      if (parentUniqueId && !checkedKeys.includes(parentUniqueId)) {
        item.parentUniqueId = '';
      }
    });
    const showAuthorityList = showAuthSaving
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
    setCheckedAuthItem([]);
  }, [terminalType]);
  const handleTransfer = () => {
    if (checkedAuthItems.length === 0) return;
    const checkedAuthItemsTmpl = JSON.parse(JSON.stringify(checkedAuthItems));
    checkedAuthItems.forEach((item) => item.disabled = true);
    AuthShowTreeRef?.onBatchAdd?.(checkedAuthItemsTmpl, checkedShowAuths);
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
    setCheckedAuthItem(checkedAuthItems.filter((item) => !keys.includes(item.uniqueId)));
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
              setCheckedAuthItem(selectedNodes);
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
            selectable = {true}
            onRef = {(AuthShowTreeRefTmpl) => {
              setAuthShowTreeRef(AuthShowTreeRefTmpl);
            }}
            expandType = {EXPAND_TYPE.EXPAND_ALL}
            height={220}
            searchParams = {{ terminalType, excludeTerminalData: true }}
            onSelect = {(selectedKeys, selectedNames, selectedNodes) => {
              setCheckedShowAuths(selectedNodes[0]);
            }}
            onDeleteNode = {handleDelteShowItem}
            canIDeleteNode = {(node) => {
              return node.attachment?.authorityId != undefined;
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
