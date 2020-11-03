import React, {
  useEffect, useState, forwardRef, useImperativeHandle
} from 'react';
import { Tree, Input } from 'antd';
import { queryMenusListService, getPageElementInTreeService } from '../service';
import './index.less';
import { MENUS_TYPE, SELECT_ALL } from '../constant';

const { Search } = Input;

interface IProps {
  onSelect?: (selectedKeys) => void;
  ref?: React.Ref<any>;
}

interface INode {
  title: string | React.ReactElement;
  name: string;
  key: string;
  id: string;
  pid: string;
}

const MeunsTree: React.FC<IProps> = forwardRef((props: IProps, ref) => {
  const { onSelect } = props;
  let searchValue = "";
  const [menusData, setMenusData] = useState<any[]>([]);
  const [expandedRightKeys, setExpandedRightKeys] = useState<string[]>(['0-0-0', '0-0-1']);
  const [checkedRightKeys, setCheckedRightKeys] = useState<string[]>(["1319197100449341440"]);
  const [selectedRightKeys, setSelectedRightKeys] = useState<string[]>([]);
  const [autoExpandRightParent, setAutoExpandRightParent] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({
    reload: () => getMenusListData()
  }));
  useEffect(() => {
    getMenusListData();
  }, []);
  const constructTree = (data) => {
    const idMap = {};
    const jsonTree: INode[] = [];
    data.forEach((node) => { node && (idMap[node.id] = node); });
    data.forEach((node: INode) => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.title = renderHighlightValue(node.name);
        // eslint-disable-next-line no-param-reassign
        node.key = node.id;
        const parent = idMap[node.pid];
        if (parent) {
          !parent.children && (parent.children = []);
          parent.children.push(node);
        } else {
          jsonTree.push(node);
        }
      }
    });
    return jsonTree;
  };

  const renderHighlightValue = (name): React.ReactElement => {
    const index = name.indexOf(searchValue);
    const beforeStr = name.substr(0, index);
    const afterStr = name.substr(index + searchValue.length);
    const title = index > -1
      ? (
        <span>
          {beforeStr}
          <span className="tree-search-value">{searchValue}</span>
          {afterStr}
        </span>
      ) : (
        <span>{name}</span>
      );
    return title;
  };

  const getPageElementInTree = async () => {
    return await getPageElementInTreeService({
      selectType: 0
    });
  };

  const getMenusListData = async () => {
    // const resA = await queryMenusListService({
    //   type: MENUS_TYPE.MODULE,
    //   name: searchValue
    // });

    // const res = await getPageElementInTreeService({
    //   selectType: 0
    // });

    const res = await getPageElementInTree();

    const tree = constructTree(res?.result || []);
    console.log(tree);
    setMenusData(tree);
  };
  // const handleSelect = (selectedKeys, {
  //   selected
  // }) => {
  //   onSelect && onSelect(selected ? selectedKeys[0] : SELECT_ALL);
  // };

  const handleSelect = (value) => {
    console.log(value);
    onSelect && onSelect(value ? value[0] : SELECT_ALL);
  };

  const handleSearch = (value) => {
    searchValue = value;
    getMenusListData();
  };

  const onRightExpand = (expandedKeysA) => {
    console.log('onRightExpand', expandedKeysA);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedRightKeys(expandedKeysA);
    setAutoExpandRightParent(false);
  };

  const onRightCheck = (checkedKeysA) => {
    console.log('onRightCheck', checkedKeysA);
    setCheckedRightKeys(checkedKeysA);
  };

  const onRightSelect = (selectedKeysA, info) => {
    console.log('onRightSelect', info);
    setSelectedRightKeys(selectedKeysA);
  };

  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        onSearch={handleSearch}
      />
      <Tree

        checkable
        onExpand={onRightExpand}
        expandedKeys={expandedRightKeys}
        autoExpandParent={autoExpandRightParent}
        onCheck={onRightCheck}
        checkedKeys={checkedRightKeys}
        selectedKeys={selectedRightKeys}

        onSelect={handleSelect}
        defaultExpandAll={true}
        style={{ width: '100%' }}
        multiple={true}
        treeData={menusData}

      />
    </div>
  );
});
export default React.memo(MeunsTree);
