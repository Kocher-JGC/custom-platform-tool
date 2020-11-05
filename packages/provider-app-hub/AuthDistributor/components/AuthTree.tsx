import React from 'react';
import { Tree, Input } from 'antd';
import { CompressOutlined, DragOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import { INode, INodeConfig } from '../interface';
import { EXPAND_TYPE } from '../constants';

interface IProps {
  onSelect?: (selectedKeys: React.Key[], selectedNames: string[]) => void;
  checkable?: boolean
  selectable?: boolean
  onRequest: (searchValue?: string) => Promise<INode[]>
  nodeConfig: INodeConfig
  checkedValues?: string[]
  onRef?: (param: React.ReactNode)=>void;
  expandType?: EXPAND_TYPE.EXPAND_ALL|EXPAND_TYPE.EXPAND_VALUES
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

  componentDidMount() {
    const { checkedValues = [], onRef } = this.props;
    this.getList().then(() => {
      const checkedKeysTmpl = this.getKeysByValues(checkedValues);
      this.setState({
        checkedKeys: checkedKeysTmpl,
        expandedKeys: this.getExpandedKeysByExpandType(checkedKeysTmpl)
      });
    });
    onRef && onRef(this);
  }

  getKeysByValues = (values) => {
    const { originalAuthList } = this.state;
    const list:string[] = [];
    originalAuthList.forEach((item) => {
      if (!values.includes(item.value)) return;
      list.push(item.key);
    });
    return list;
  }

  getExpandedKeysByExpandType = (checkedKeysTmpl) => {
    const { expandType } = this.props;
    const { allParentKeys } = this.state;
    if (expandType === EXPAND_TYPE.EXPAND_ALL) {
      return allParentKeys;
    } if (expandType === EXPAND_TYPE.EXPAND_VALUES) {
      return checkedKeysTmpl.reduce((arr, item) => {
        return arr.concat(this.getAllParentKeysByKey(item));
      }, []);
    }
    return [];
  }

  getAllParentKeysByKey = (key) => {
    const { authMapByKey } = this.state;
    const { parentUniqueId } = authMapByKey[key];
    if (parentUniqueId) {
      return [parentUniqueId, ...this.getAllParentKeysByKey(parentUniqueId)];
    }
    return [];
  }

  reload = () => {
    this.getList();
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
    const { columnImg, titleBeautifyBySearchValue } = this.props.nodeConfig;
    for (const key in columnImg) {
      node[key] = get(node, columnImg[key]);
    }
    if (titleBeautifyBySearchValue) {
      const { name } = node;
      node.title = this.renderHighlightValue(name);
    }
    node.key = node.uniqueId;
    return node;
  };

  /**
   * 构造树组件所需结构
   * @param data 后端返回树结构
   */
  constructTree = (data) => {
    const map: {[key: string]: INode} = {};
    const tree: INode[] = [];
    const parentKeyList: string[] = [];
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

  /**
   * 通知上级
   */
  onAfterCheck = () => {
    const { checkedKeys, authMapByKey } = this.state;
    const { onSelect } = this.props;
    const checkedValues = checkedKeys.map((item) => authMapByKey[item].value);
    const checkedNames = checkedKeys.map((item) => authMapByKey[item].name);
    onSelect && onSelect(checkedValues, checkedNames);
  }

  render() {
    const {
      expandedKeys, checkedKeys, authList
    } = this.state;
    const { checkable, selectable } = this.props;
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
