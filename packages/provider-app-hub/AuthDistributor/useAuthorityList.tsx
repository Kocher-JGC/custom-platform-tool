import React, {
  useEffect, useState
} from 'react';
import get from 'lodash/get';
import { INode, INodeConfig } from './interface';
// import './index.less';

type IUseAuthorityList = (
  requestFunc: (searchValue?: string) => Promise<INode[]>,
  nodeConfig: INodeConfig
) => [INode[], {[param: string]:INode}, string[], (searchValue?: string) => void]

const useAuthorityList: IUseAuthorityList = (requestFunc, nodeConfig) => {
  const [authList, setAuthList] = useState<INode[]>([]);
  const [authMap, setAuthMap] = useState<{[param: string]:INode}>({});
  const [parentMenuKeyList, setParentMenuKeyList] = useState<string[]>([]);

  const constructNodeByColumnConfig = (node, searchValue) => {
    const { columnImg, titleBeautifyBySearchValue } = nodeConfig;
    for (const key in columnImg) {
      node[key] = get(node, columnImg[key]);
    }
    if (titleBeautifyBySearchValue) {
      const { name } = node;
      node.title = searchValue ? renderHighlightValue(name, searchValue) : name;
    }
    node.key = node.uniqueId;
    return node;
  };
  /**
   * 构造树组件所需结构
   * @param data 后端返回树结构
   */
  const constructTree = (data, searchValue?: string) => {
    const map = {};
    const tree: INode[] = [];
    const parentKeyList: string[] = [];
    data.forEach((node: INode) => {
      if (!node) return;
      constructNodeByColumnConfig(node, searchValue);
      map[node.uniqueId] = node;
    });
    console.log(data);
    data.forEach((node: INode) => {
      if (node) {
        const { parentUniqueId } = node;
        const parent = map[parentUniqueId];
        if (parent) {
          !parent.children && (parent.children = []);
          !parentKeyList.includes(parentUniqueId) && parentKeyList.push(parentUniqueId);
          parent.children.push(node);
        } else {
          tree.push(node);
        }
      }
    });
    return { tree, parentKeyList, map };
  };
  /**
   * 渲染高亮（匹配搜索框）
   * @param name 菜单名
   */
  const renderHighlightValue = (name: string, value:string): React.ReactElement => {
    const nameSplit = name.split(value);
    const nameSplitLength = nameSplit.length;
    const title = nameSplitLength > 0
      ? (
        <span>
          {nameSplit.map((item, index) => {
            if (index === nameSplitLength - 1) {
              return <span>{item}</span>;
            }
            return (
              <>
                <span>{item}</span>
                <span className="tree-search-value">{value}</span>
              </>
            );
          })}
        </span>
      ) : (
        <span>{name}</span>
      );
    return title;
  };
  /**
   * 获取菜单数据
   */
  const getMenuData = (searchValue?: string) => {
    requestFunc(searchValue).then((res) => {
      const { tree, parentKeyList, map } = constructTree(res, searchValue);
      setAuthList(tree);
      setAuthMap(map);
      setParentMenuKeyList(parentKeyList);
    });
  };
  useEffect(() => {
    getMenuData();
  }, []);
  return [authList, authMap, parentMenuKeyList, getMenuData];
};

export default useAuthorityList;
