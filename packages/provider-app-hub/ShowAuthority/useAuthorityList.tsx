import React, {
  useEffect, useState
} from 'react';
import { DataNode } from "antd/lib/tree";
import { getShowAuthoritiesTree } from './services/apiAgents';
import { INode } from './interface';
// import './index.less';

type IUseAuthorityList = () => [DataNode[], (searchValue?: string) => void]

const useAuthorityList: IUseAuthorityList = () => {
  const [menuData, setMenuData] = useState<DataNode[]>([]);
  /**
   * 构造树组件所需结构
   * @param data 后端返回树结构
   */
  const constructTree = (data, searchValue?: string) => {
    const idMap = {};
    const jsonTree: INode[] = [];
    data.forEach((node: INode) => { node && (idMap[node.code] = node); });
    data.forEach((node: INode) => {
      if (node) {
        const { code, name, parentCode } = node;
        node.title = searchValue ? renderHighlightValue(name, searchValue) : name;
        node.key = code;
        node.value = code;
        const parent = idMap[parentCode];
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
    getShowAuthoritiesTree({
      name: searchValue
    }).then((res) => {
      const tree = constructTree(res, searchValue);
      setMenuData(tree);
    });
  };
  useEffect(() => {
    getMenuData();
  }, []);
  return [menuData, getMenuData];
};

export default useAuthorityList;
