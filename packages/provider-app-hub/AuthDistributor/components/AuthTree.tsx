import React, {
  forwardRef, useState
} from 'react';
import { Tree, Input } from 'antd';
import { CompressOutlined, DragOutlined } from '@ant-design/icons';
import useAuthorityList from '../useAuthorityList';
import { INode, INodeConfig } from '../interface';

interface IProps {
  onSelect?: (selectedKeys: React.Key[], selectedNames: string[]) => void;
  checkable?: boolean
  selectable?: boolean
  onRequest: (searchValue?: string) => Promise<INode[]>
  nodeConfig: INodeConfig
}
type IUseCheckedKeys = (
  onSelect?: (selectedKeys: React.Key[]) => void,
) => [
  React.Key[], (checkedKeys: React.Key[]) => void
]
const useCheckedKeys:IUseCheckedKeys = (onSelectKeys) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const useChecked = (keys: React.Key[]) => {
    setCheckedKeys(keys);
    onSelectKeys && onSelectKeys(keys);
  };
  return [checkedKeys, useChecked];
};
const AuthTree = forwardRef((props: IProps, ref: React.Ref<{reload: () => void}>) => {
  const { onSelect, onRequest, nodeConfig } = props;
  const [authList, authMap, defExpandedKeys, getAuthorityData] = useAuthorityList(onRequest, nodeConfig);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useCheckedKeys((allCheckedKeys) => {
    const checkedValues = allCheckedKeys.map((item) => authMap[item].value);
    const allCheckedNames = allCheckedKeys.map((item) => authMap[item].name);
    onSelect && onSelect(checkedValues, allCheckedNames);
  });

  const onExpand = () => {
    setExpandedKeys(expandedKeys.length > 0 ? [] : defExpandedKeys);
  };
  const getKeys = (node) => {
    const list = (Array.isArray(node.children) && node.children.reduce((listTmpl, item) => {
      return [...listTmpl, ...getKeys(item)];
    }, [])) || [];
    return [node.code, ...list];
  };
  const onExpandBySelect = (selectedNode) => {
    const keyList = getKeys(selectedNode);
    setExpandedKeys([...expandedKeys, ...keyList]);
  };
  return (
    <div>
      <Input.Search
        className="mb-4"
        onSearch={getAuthorityData}
      />
      <div style={{ height: 20 }}>
        {
          expandedKeys.length > 0
            ? <CompressOutlined
              className = "float-right"
              onClick={onExpand}
            /> : <DragOutlined
              className = "float-right"
              onClick={onExpand}
            />
        }
      </div>
      <Tree
        checkable = {props.checkable || false}
        selectable = {props.selectable || false}
        checkedKeys = {checkedKeys}
        selectedKeys = {checkedKeys}
        expandedKeys = {expandedKeys}
        treeData={authList}
        onCheck={(checkedKeysTmpl, {
          checked, node
        }) => {
          checkedKeysTmpl = Array.isArray(checkedKeysTmpl) ? checkedKeysTmpl : checkedKeysTmpl.checked;
          setCheckedKeys(checkedKeysTmpl);
          checked && onExpandBySelect(node);
        }}
        onSelect={(selectedKeysTmpl) => {
          setCheckedKeys(selectedKeysTmpl);
        }}
        onExpand = {(expandedKeysTmpl) => {
          setExpandedKeys(expandedKeysTmpl);
        }}
      />
    </div>
  );
});
export default React.memo(AuthTree);
