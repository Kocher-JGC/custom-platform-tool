import React from 'react';
import { Tree, Input } from 'antd';
import { CompressOutlined, DragOutlined, CloseCircleOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { INode, INodeConfig } from '../interface';
import { EXPAND_TYPE } from '../constants';

interface IProps {
  onSelect?: (selectedKeys: React.Key[], selectedNames: string[], selectedNodes: INode[]) => void;
  checkable?: boolean
  selectable?: boolean
  onRequest: (searchValue?: string) => Promise<INode[]>
  nodeConfig: INodeConfig
  nodeBeautify?: (node: INode)=> INode
  onDeleteNode?: (nodes: INode[], keys: React.Key[])=>void
  canIDeleteNode?: (node: INode)=>boolean
  onInitCheckedKeys?: (authList: INode[], authMapByKey: {[param: string]: INode}, originalAuthList: INode[])=>void
  onRef?: (param: React.ReactNode)=>void;
  expandType?: EXPAND_TYPE.EXPAND_ALL|EXPAND_TYPE.EXPAND_VALUES
  width?: number
  height?: number
}

interface IState {
  originalAuthList: INode[]
  authList: INode[]
  authMapByKey: {[param: string]: INode}
  allParentKeys: React.Key[]
  checkedKeys: React.Key[]

  expandedKeys: React.Key[]
  searchValue: React.Key

}

class AuthTree extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      originalAuthList: [],
      authList: [],
      authMapByKey: {},
      allParentKeys: [],
      checkedKeys: [],
      searchValue: '',
      expandedKeys: []
    };
  }

  /**
   * 组件初始化
   */
  componentDidMount() {
    const { onRef, onInitCheckedKeys } = this.props;
    /** 1.请求回树形数据，进行结构化转化 */
    this.getList().then(() => {
      const { authList, authMapByKey, originalAuthList } = this.state;
      /** 2.根据父级指示初始化选中节点； */
      const checkedKeysTmpl = onInitCheckedKeys && onInitCheckedKeys(authList, authMapByKey, originalAuthList) || [];
      this.setState({
        checkedKeys: checkedKeysTmpl
      }, () => {
        /** 3.根据父级指示进行节点展开 */
        this.getExpandedKeysByExpandType();
      });
    });
    onRef && onRef(this);
  }

  /**
   * 根据 props.expandType 计算 expandedKeys
   * 全部展开/展开回填数据所有上级
   */
  getExpandedKeysByExpandType = () => {
    const { expandType } = this.props;
    const { allParentKeys, checkedKeys } = this.state;
    if (expandType === EXPAND_TYPE.EXPAND_ALL) {
      return allParentKeys;
    } if (expandType === EXPAND_TYPE.EXPAND_VALUES) {
      return checkedKeys.reduce((arr, item) => {
        return arr.concat(this.getAllParentKeysByKey(item));
      }, []);
    }
    return [];
  }

  /**
   * 根据节点唯一标识返回所有上级节点唯一标识列表
   * @param key 节点唯一标识
   * @returns keys 所有上级节点唯一标识列表
   */
  getAllParentKeysByKey = (key) => {
    const { authMapByKey } = this.state;
    const { parentUniqueId } = authMapByKey[key];
    if (parentUniqueId) {
      return [parentUniqueId, ...this.getAllParentKeysByKey(parentUniqueId)];
    }
    return [];
  }

  reloadWithKeysRetain = () => {
    this.getList().then(() => {
      const { originalAuthList, checkedKeys, expandedKeys } = this.state;
      const allKeys = originalAuthList.map((item) => item.uniqueId);
      this.setState({
        checkedKeys: checkedKeys.filter((item) => allKeys.includes(item)),
        expandedKeys: expandedKeys.filter((item) => allKeys.includes(item)),
      });
    });
  }

  reload = () => {
    this.getList().then(() => {
      this.setState({
        checkedKeys: [],
        expandedKeys: [],
      });
    });
  }

  onBatchAdd = (list) => {
    list.forEach((node) => {
      node.children = null;
    });
    let { authMapByKey, authList, allParentKeys } = this.state;
    const { tree, map, parentKeyList } = this.constructTree(list);
    authMapByKey = { ...authMapByKey, ...map };
    authList = authList.slice();
    allParentKeys = allParentKeys.filter((item) => !parentKeyList.includes(item)).concat(parentKeyList);
    tree.forEach((item) => {
      const { parentUniqueId } = item;
      if (parentUniqueId in authMapByKey) {
        authMapByKey[parentUniqueId].children = authMapByKey[parentUniqueId].children || [];
        authMapByKey[parentUniqueId].children?.unshift(item);
        !allParentKeys.includes(parentUniqueId) && allParentKeys.push(parentUniqueId);
        return;
      }
      // item.parentUniqueId = '';
      authList.unshift(item);
    });
    const shoudeBeNullIndexList:number[] = [];
    authList.forEach((item, index) => {
      const { parentUniqueId, uniqueId } = item;
      if (!(parentUniqueId in authMapByKey)) return;
      shoudeBeNullIndexList.push(index);
      !allParentKeys.includes(uniqueId) && allParentKeys.push(uniqueId);
    });
    authList = authList.filter((item, index) => !shoudeBeNullIndexList.includes(index));
    this.setState({
      authMapByKey,
      authList,
      allParentKeys
    }, () => {
      this.getExpandedKeysByExpandType();
    });
  }

  /**
   * 渲染高亮（匹配搜索框）
   * @param name 节点名称
   * @param value 用户搜素值
   */
  renderHighlightValue = (name: string): React.ReactElement => {
    const { searchValue } = this.state;
    const nameSplit = name.split(searchValue);
    const nameSplitLength = nameSplit.length;
    const title = searchValue && nameSplitLength > 0
      ? (
        <span>
          {nameSplit.map((item, index) => {
            if (item) {
              if (index === nameSplitLength - 1) {
                return <span key={index.toString()}>{item}</span>;
              }
              return (
                <span key={index.toString()}>
                  <span>{item}</span>
                  <span className="tree-search-value">{searchValue}</span>
                </span>
              );
            }
            if (index < nameSplitLength - 1) {
              return <span key={searchValue} className="tree-search-value">{searchValue}</span>;
            }
            return null;
          })}
        </span>
      ) : (
        <span>{name}</span>
      );
    return title;
  };

  /**
   * 构造节点数据
   * @param node 节点数据
   */
  constructNodeByColumnConfig = (node: INode) => {
    const {
      nodeBeautify,
      nodeConfig: { columnImg, titleBeautifyBySearchValue },
      canIDeleteNode
    } = this.props;
    for (const key in columnImg) {
      node[key] = get(node, columnImg[key]);
    }
    const { name } = node;
    let Title = (<span>{name}</span>);
    if (titleBeautifyBySearchValue) {
      Title = this.renderHighlightValue(name);
    }
    if (typeof canIDeleteNode === 'function' && canIDeleteNode(node)) {
      Title = (
        <span>
          {Title}
          <CloseCircleOutlined
            onClick={() => { this.onDeleteNode(node); }}
            className="ml-2"
          />
        </span>
      );
    }
    node.title = Title;
    node.key = node.uniqueId;
    typeof nodeBeautify === 'function' && nodeBeautify(node);
    return node;
  };

  /**
   * 构造树组件所需结构
   * @param data 后端返回树结构
   */
  constructTree = (data) => {
    const map: {[key: string]: INode} = {};
    const tree: INode[] = [];
    const parentKeyList: React.Key[] = [];
    data.forEach((node: INode) => {
      if (!node) return;
      this.constructNodeByColumnConfig(node);
      map[node.uniqueId] = node;
    });
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
   * 获取权限数据
   */
  getList = () => {
    return new Promise((resolve, reject) => {
      const { searchValue } = this.state;
      this.props.onRequest(searchValue).then((res) => {
        const { tree, parentKeyList, map } = this.constructTree(res);
        this.setState({
          originalAuthList: res,
          authList: tree,
          authMapByKey: map,
          allParentKeys: parentKeyList,
        }, () => {
          resolve();
        });
      });
    });
  }

  /**
   * 控制展开搜索
   */
  onExpandAll = () => {
    const { expandedKeys, allParentKeys } = this.state;
    this.setState({
      expandedKeys: expandedKeys.length > 0 ? [] : allParentKeys
    });
  };

  onDeleteNode = (node) => {
    const { onDeleteNode } = this.props;
    const { parentList, index } = this.findParentUntilNotOnlyOne(node);
    const relatedNodeList = this.getChildNodeList(parentList[index]);
    if (typeof onDeleteNode === 'function') {
      onDeleteNode(relatedNodeList, relatedNodeList.map((item) => item.uniqueId));
    }
    parentList.splice(index, 1);
    const { authList } = this.state;
    this.setState({
      authList: authList.slice()
    });
  }

  getChildNodeList = (node: INode): INode[] => {
    if (!node.children) {
      return [node];
    }
    const list: INode[] = [];
    node.children.forEach((item) => list.push.apply(list, [...this.getChildNodeList(item)]));
    return [...list, node];
  }

  findParentUntilNotOnlyOne = (node) => {
    const { authMapByKey, authList } = this.state;
    const { parentUniqueId, uniqueId } = node;
    let parentList = authList;
    const { [parentUniqueId]: parentNode } = authMapByKey;
    if (parentNode) {
      parentList = parentNode.children || [];
      if (parentList.length === 1) {
        return this.findParentUntilNotOnlyOne(parentNode);
      }
    }
    let index = -1;
    parentList.some((item, loopIndex) => {
      if (item.uniqueId === uniqueId) {
        index = loopIndex;
        return true;
      }
      return false;
    });
    return { parentList, index };
  }

  onUpdateCheckedNodes = (actionFn) => {
    if (typeof actionFn !== 'function') return;
    const {
      checkedKeys, originalAuthList, authList, authMapByKey
    } = this.state;
    const checkedNodes = originalAuthList.filter((item) => checkedKeys.includes(item.key));
    checkedNodes.forEach((item) => {
      actionFn(item, item.uniqueId);
    });
    this.setState({
      originalAuthList: originalAuthList.slice(),
      authList: authList.slice(),
      authMapByKey: { ...authMapByKey }
    });
  }

  /**
   * 通知上级
   */
  onAfterCheck = () => {
    const { checkedKeys, authMapByKey, originalAuthList } = this.state;
    const { onSelect } = this.props;
    const checkedValues = checkedKeys.map((item) => authMapByKey[item].value);
    const checkedNames = checkedKeys.map((item) => authMapByKey[item].name);
    const checkedNodes = originalAuthList.filter((item) => checkedKeys.includes(item.key));
    onSelect && onSelect(checkedValues, checkedNames, checkedNodes);
  }

  onCancelCheckedKeys = (keys) => {
    this.setState({
      checkedKeys: this.state.checkedKeys.filter((key) => !keys.includes(key))
    });
  }

  render() {
    const {
      expandedKeys, checkedKeys, authList
    } = this.state;
    const {
      checkable, selectable, height, width
    } = this.props;
    return (
      <div>
        <Input.Search
          className="mb-4"
          onSearch={(searchValue) => {
            this.setState({ searchValue }, () => {
              this.getList().then(() => {
                this.setState({
                  expandedKeys: this.state.allParentKeys
                });
              });
            });
          }}
        />
        <div style={{ height: 20 }}>
          {
            expandedKeys.length > 0
              ? <CompressOutlined
                className = "float-right"
                onClick={this.onExpandAll}
              /> : <DragOutlined
                className = "float-right"
                onClick={this.onExpandAll}
              />
          }
        </div>
        <Tree
          height = {height}
          checkable = {checkable || false}
          selectable = {selectable || false}
          checkedKeys = {checkedKeys}
          selectedKeys = {checkedKeys}
          expandedKeys = {expandedKeys}
          treeData={authList}
          onCheck={(checkedKeysTmpl, {
            checked
          }) => {
            checkedKeysTmpl = Array.isArray(checkedKeysTmpl) ? checkedKeysTmpl : checkedKeysTmpl.checked;
            this.setState({
              checkedKeys: checkedKeysTmpl,
              expandedKeys: checked ? [...expandedKeys, ...checkedKeysTmpl] : expandedKeys
            }, () => {
              this.onAfterCheck();
            });
          }}
          onSelect={(selectedKeysTmpl) => {
            this.setState({ checkedKeys: selectedKeysTmpl }, () => {
              this.onAfterCheck();
            });
          }}
          onExpand = {(expandedKeysTmpl) => {
            this.setState({ expandedKeys: expandedKeysTmpl });
          }}
        />
      </div>
    );
  }
}
export default React.memo(AuthTree);
