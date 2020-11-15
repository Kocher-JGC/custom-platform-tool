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
  searchValue: string

}

/**
 * 底层树
 */
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
        this.setExpandedKeysByExpandType();
      });
    });
    onRef && onRef(this);
  }

  /**
   * 根据 props.expandType 计算 expandedKeys
   * 全部展开/展开回填数据所有上级
   */
  setExpandedKeysByExpandType = () => {
    const { expandType } = this.props;
    const { allParentKeys, checkedKeys, originalAuthList } = this.state;
    let expandedKeys: React.Key[] = [];
    if (expandType === EXPAND_TYPE.EXPAND_ALL) {
      /** 全部展开 */
      expandedKeys = allParentKeys;
    } else if (expandType === EXPAND_TYPE.EXPAND_VALUES) {
      /** 只展开选中数据 */
      const allKeys = originalAuthList.map((item) => item.uniqueId);
      expandedKeys = checkedKeys
        /** 避免有不存在的选中数据 */
        .filter((item) => allKeys.includes(item))
        .reduce((arr, item) => {
          return arr.concat(this.getAllParentKeysByKey(item));
        }, []);
    }
    this.setState({ expandedKeys });
  }

  /**
   * 根据节点唯一标识返回所有上级节点唯一标识列表
   * @param key 节点唯一标识
   * @returns keys 所有上级节点唯一标识列表
   */
  getAllParentKeysByKey = (key) => {
    const { authMapByKey } = this.state;
    const { parentUniqueId } = authMapByKey[key] || {};
    if (parentUniqueId && parentUniqueId in authMapByKey) {
      return [parentUniqueId, ...this.getAllParentKeysByKey(parentUniqueId)];
    }
    return [];
  }

  /**
   * 更新树形数据，但保留原有选中和展开
   */
  reloadWithKeysRetain = () => {
    return new Promise((resolve, reject) => {
      this.getList().then(() => {
        const { originalAuthList, checkedKeys, expandedKeys } = this.state;
        const allKeys = originalAuthList.map((item) => item.uniqueId);
        this.setState({
          /** 但需要对数据进行过滤，避免选中项中有已被删除的数据 */
          checkedKeys: checkedKeys.filter((item) => allKeys.includes(item)),
          /** 但需要对数据进行过滤，避免展开项中有已被删除的数据 */
          expandedKeys: expandedKeys.filter((item) => allKeys.includes(item)),
        }, resolve);
      });
    });
  }

  /**
   * 更新树形数据，并清空原有选中和展开
   */
  reload = () => {
    return new Promise((resolve, reject) => {
      this.setState({
        checkedKeys: [],
        expandedKeys: []
      }, () => {
        this.getList().then(resolve);
      });
    });
  }

  /**
   * 批量新增节点数据
   * @param list INode[]
   */
  onBatchAdd = (list: INode[]) => {
    /** 去除子项数据，防止与转化后的数据重复 */
    list.forEach((node) => {
      if (!node.children) return;
      node.children = null;
    });
    let { authMapByKey, authList, allParentKeys } = this.state;
    /** 对节点数据做结构化转化 */
    const { tree, map, parentKeyList } = this.constructTree(list);
    authMapByKey = { ...authMapByKey, ...map };
    authList = authList.slice();
    allParentKeys = allParentKeys.filter((item) => !parentKeyList.includes(item)).concat(parentKeyList);
    /** 将新增的数据节点挂到当前树中 */
    tree.forEach((item) => {
      const { parentUniqueId } = item;
      /** 挂到对应上级节点中 */
      if (parentUniqueId in authMapByKey) {
        authMapByKey[parentUniqueId].children = authMapByKey[parentUniqueId].children || [];
        authMapByKey[parentUniqueId].children?.unshift(item);
        !allParentKeys.includes(parentUniqueId) && allParentKeys.push(parentUniqueId);
        return;
      }
      /** 直接挂在最外层 */
      authList.unshift(item);
    });
    /** 判断当前树节点有无能挂到新加的树节点中的 */
    const shoudeBeNullIndexList:number[] = [];
    authList.forEach((item, index) => {
      const { parentUniqueId, uniqueId } = item;
      if (!(parentUniqueId in authMapByKey)) return;
      /** 发现原有最外层节点，其实是有上级的（且上级有数据的），则要把最外层节点干掉 */
      shoudeBeNullIndexList.push(index);
      !allParentKeys.includes(uniqueId) && allParentKeys.push(uniqueId);
    });
    /** 由于直接在循环中干掉数据，会影响循环，需要在循环外进行数据清除 */
    authList = authList.filter((item, index) => !shoudeBeNullIndexList.includes(index));
    this.setState({
      authMapByKey,
      authList,
      allParentKeys
    }, () => {
      this.setExpandedKeysByExpandType();
    });
  }

  /**
   * 渲染树节点中（匹配搜索框）的高亮文字
   * @param name 节点名称
   * @param value 用户搜素值
   */
  renderHighlightValue = (name: string): React.ReactElement => {
    const { searchValue } = this.state;
    /** 如，以“爷”匹配“太爷爷1” */
    const nameSplit = name.split(searchValue);
    /** 则 nameSplit 为 ["太", "", "", "1"] */
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
    /** 进行记录的字段数据转换 */
    for (const key in columnImg) {
      node[key] = get(node, columnImg[key]);
    }
    const { name } = node;
    let Title = (<span>{name}</span>);
    /** 是否需要根据搜索高亮显示节点文字 */
    if (titleBeautifyBySearchValue) {
      Title = this.renderHighlightValue(name);
    }
    /** 是否支持删除节点数据 */
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
    /** 支持父级对节点数据做处理 */
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
   * 获取数据
   */
  getList = () => {
    return new Promise((resolve, reject) => {
      const { searchValue } = this.state;
      /** 父级提供的数据获取方法 */
      this.props.onRequest(searchValue).then((res) => {
        /** 进行数据转化 */
        const { tree, parentKeyList, map } = this.constructTree(res);
        this.setState({
          originalAuthList: res,
          authList: tree,
          authMapByKey: map,
          allParentKeys: parentKeyList,
        }, () => {
          /** 接受数据赋入后进行后续操作 */
          resolve();
        });
      });
    });
  }

  /**
   * 控制全部展开/收缩
   */
  onExpandAll = () => {
    const { expandedKeys, allParentKeys } = this.state;
    /** 但凡存在展开项，就只能收缩 */
    this.setState({
      expandedKeys: expandedKeys.length > 0 ? [] : allParentKeys
    });
  };

  /**
   * 删除节点数据
   * @param node
   */
  onDeleteNode = (node) => {
    const { onDeleteNode } = this.props;
    /** 获取当前节点对应的可删除的最顶层节点数据（可删除即，只有一个子项数据） */
    const { parentList, index } = this.findParentUntilNotOnlyOne(node);
    /** 关联所有子项数据，支持提供给外部处理 */
    const relatedNodeList = this.getChildNodeList(parentList[index]);
    /** 支持父级回调，能拿到所有待删除的节点数据 */
    if (typeof onDeleteNode === 'function') {
      onDeleteNode(relatedNodeList, relatedNodeList.map((item) => item.uniqueId));
    }
    parentList.splice(index, 1);
    const { authList } = this.state;
    this.setState({
      authList: authList.slice()
    });
  }

  /**
   * 获取节点下的所有节点数据
   * @param node 指定节点
   * @returns nodeList 子节点数据
   */
  getChildNodeList = (node: INode): INode[] => {
    if (!node.children) {
      return [node];
    }
    const list: INode[] = [];
    node.children.forEach((item) => list.push.apply(list, [...this.getChildNodeList(item)]));
    return [...list, node];
  }

  /**
   * 获取对应节点的（只有一个子级）的最顶层上级
   * @param node
   */
  findParentUntilNotOnlyOne = (node) => {
    const { authMapByKey, authList } = this.state;
    const { parentUniqueId } = node;
    let parentList = authList;
    const { [parentUniqueId]: parentNode } = authMapByKey;
    if (parentNode) {
      parentList = parentNode.children || [];
      /** 如果只有一个子级，就继续往上找 */
      if (parentList.length === 1) {
        return this.findParentUntilNotOnlyOne(parentNode);
      }
    }
    /** 获取节点在所属列表数据中的索引 */
    const index = this.getIndexInList(parentList, node);
    return { parentList, index };
  }

  /**
   * 获取节点在给定列表中的索引
   * @param list INode[] 节点列表数据
   * @param param1 INode 节点数据
   */
  getIndexInList = (list, { uniqueId }) => {
    let index = -1;
    list.some((item, loopIndex) => {
      if (item.uniqueId === uniqueId) {
        index = loopIndex;
        return true;
      }
      return false;
    });
    return index;
  }

  /**
   * 接受父级实时改动选中数据
   * @param actionFn (node, uniqueId)=>void
   */
  onUpdateCheckedNodes = (actionFn) => {
    if (typeof actionFn !== 'function') return;
    const {
      checkedKeys, originalAuthList, authList, authMapByKey
    } = this.state;
    /** 提供给外部平铺开的节点数据 */
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
   * 通知父级选中数据
   */
  onAfterCheck = () => {
    const { checkedKeys, authMapByKey, originalAuthList } = this.state;
    const { onSelect } = this.props;
    const checkedValues = checkedKeys.map((item) => authMapByKey[item].value);
    const checkedNames = checkedKeys.map((item) => authMapByKey[item].name);
    const checkedNodes = originalAuthList.filter((item) => checkedKeys.includes(item.key));
    onSelect && onSelect(checkedValues, checkedNames, checkedNodes);
  }

  /**
   * 由父级直接控制取消选中节点数据
   * @param keys 待取消的节点唯一标识
   */
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
          allowClear
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
        <div style={{ height: 20 }} className="mt-3">
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
        {
          authList.length > 0 ? (
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
              onExpand = {(expandedKeysTmpl, { expanded, node }) => {
                if (expanded) {
                  this.setState({ expandedKeys: expandedKeysTmpl }); return;
                }
                const childKeys = this.getChildNodeList(node).map((item) => item.uniqueId);
                this.setState({
                  expandedKeys: expandedKeysTmpl.filter((item) => !(childKeys.includes(item)))
                });
              }}
            />
          ) : <div className="text-center">暂无数据</div>
        }

      </div>
    );
  }
}
export default React.memo(AuthTree);
