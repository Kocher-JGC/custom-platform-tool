/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, forwardRef, useImperativeHandle
} from 'react';
import produce from 'immer';
import {
  Form, Input, Select, Tree, message, notification, Row, Col
} from 'antd';
import {
  TABLE_OPTIONS, TABLE_TYPE, SPECIES, MENUS_TYPE, SELECT_ALL
} from '../constant';

import {
  FromFooterBtn
} from "./FormItem";
import CreateMenu from './CreateMenu';
import { createLesseeAuthorityFastService, findAuthorityInTreeService, getPageElementInTreeService } from '../service';
import { ILesseeAuthority, ISELECTSMENU } from '../interface';

import './index.less';
import CreateModal from './CreateModal';

const { Option } = Select;
const { TextArea } = Input;

interface IProps {
  onOk: () => void;
  onCancel: () => void;

  upDataMenus: () => void;
}

interface IMenuProps {
  onSelect?: (selectedKeys) => void;
  ref?: React.Ref<any>;
}

interface INode {
  title: string | React.ReactElement;
  name: string;
  key: string;
  id: string;
  pid: string;

  disabled: boolean;
}

interface IAuthNode {
  code: string;
  name: string;
  parentCode: string;

  createType: string;

}

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export const translateParentCodeToSelectMenus = (record: ILesseeAuthority[]):ISELECTSMENU[] => {
  if (!Array.isArray(record)) return [];
  return record
    // .filter((item) => item.fieldType !== FIELDTYPE.TEXT)
    .map((item) => {
      return {
        key: item?.code,
        value: item?.code,
        label: item?.name
      };
    });
};

interface IMenuInstance {
  reload: () => void;
}
interface IState {
  moduleId: string;
}

const CreateLesseeAuthorityFast: React.FC<IProps> = (props: IProps) => {
  const { onCancel, onOk, upDataMenus } = props;
  const [form] = Form.useForm();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [parentCodeOptions, setParentCodeOptions] = useState<ISELECTSMENU[]>([]);
  const [showTypeWithoutAuthority, setShowTypeWithoutAuthority] = useState<string>('FORBIDDEN');
  // const menuRef = React.createRef<IMenuInstance>();
  const [moduleId, setModuleId] = useState<number>(0);
  const [leftTreeData, setLeftTreeData] = useState<any[]>([]);
  const [rightTreeData, setRightTreeData] = useState<any[]>([]);
  const [disableTreeData, setDisableTreeData] = useState<any[]>([]);
  const [authFlatTreeData, setAuthFlatTreeData] = useState<any[]>([]);
  const [pageFlatTreeData, setPageFlatTreeData] = useState<any[]>([]);

  const [expandedLeftKeys, setExpandedLeftKeys] = useState<string[]>(['0-0-0', '0-0-1']);
  const [checkedLeftKeys, setCheckedLeftKeys] = useState<string[]>(["1319197100449341440"]);
  const [selectedLeftKeys, setSelectedLeftKeys] = useState<string[]>([]);
  const [autoExpandLeftParent, setAutoExpandLeftParent] = useState<boolean>(true);

  const [expandedRightKeys, setExpandedRightKeys] = useState<string[]>(['0-0-0', '0-0-1']);
  const [checkedRightKeys, setCheckedRightKeys] = useState<string[]>(["1319197100449341440"]);
  const [selectedRightKeys, setSelectedRightKeys] = useState<string[]>([]);
  const [autoExpandRightParent, setAutoExpandRightParent] = useState<boolean>(true);

  // const onLeftExpand = (expandedKeysA) => {
  //   console.log('onLeftExpand', expandedKeysA);
  //   // if not set autoExpandParent to false, if children expanded, parent can not collapse.
  //   // or, you can remove all expanded children keys.
  //   setExpandedLeftKeys(expandedKeysA);
  //   // setExpandedRightKeys(expandedKeysA);
  //   setAutoExpandLeftParent(false);
  // };

  const onLeftCheck = (checkedKeysA) => {
    console.log('onLeftCheck', checkedKeysA);
    setCheckedLeftKeys(checkedKeysA);
    setCheckedRightKeys(checkedKeysA);
  };

  const onLeftSelect = (selectedKeysA, info) => {
    console.log('onLeftSelect', info);
    setSelectedLeftKeys(selectedKeysA);
    // setSelectedRightKeys(selectedKeysA);
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

  /** TODO: 每次都要重新生成树以及重新建立父子关系 */
  const constructLeftTree = (data: any[]) => {
    const idMap = {};
    const jsonTree: INode[] = [];
    /** TODO: PID必须为null才为顶级 */
    const addExtralData = (node: INode) => ({
      ...node,
      title: node.name,
      key: node.id,
      children: []
      // disabled： node.disabled,
    });
    /** 重新建立父子关系 */
    const genChild = (node: INode) => {
      const parent = idMap[node.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(node);
      }
    };
    /** 重新生成树 */
    const genTreeTopLevel = (node: INode) => {
      /** TODO: PID必须为null才为顶级 */
      if (node.pid === null) {
        jsonTree.push(node);
      }
    };

    /** 映射转换数据 */
    data.forEach((node) => {
      /** 添加额外数据， 重置children */
      if (node) {
        idMap[node.id] = addExtralData(node);
      }
    });

    Object.keys(idMap).forEach((key) => {
      const node: INode = idMap[key];
      genChild(node);
      genTreeTopLevel(node);
    });

    return jsonTree;
  };
  // 这是一份有问题的代码constructRightTree，在某些控件的父控件没有push的时候，会导致idMap[node.pid];没有值
  const constructRightTree = (data) => {
    const idMap = {};
    const jsonTree: INode[] = [];
    data.forEach((node) => { node && (idMap[node.id] = node); });
    data.forEach((node: INode) => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.title = node.name;
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

  // const constructRightTree = (data) => {
  //   const idMap = {};
  //   const jsonTree: INode[] = [];
  //   data.forEach((node) => { node && (idMap[node.id] = node); });
  //   data.forEach((node: INode) => {
  //     if (node) {
  //       const tempNode = JSON.parse(JSON.stringify(node));
  //       // eslint-disable-next-line no-param-reassign
  //       tempNode.title = node.name;
  //       // eslint-disable-next-line no-param-reassign
  //       tempNode.key = node.id;

  //       const parent = JSON.parse(JSON.stringify(idMap[node.pid]));
  //       if (parent) {
  //         !parent.children && (parent.children = []);
  //         parent.children.push(tempNode);
  //       } else {
  //         jsonTree.push(tempNode);
  //       }
  //     }
  //   });
  //   return jsonTree;
  // };

  const getItem = (id):any => {
    let res = null;
    pageFlatTreeData.forEach((item) => {
      if (item.id === id.toString()) {
        res = item;
      }
    });
    return res;
  };
  const getCodeAndParentCode = (tree) => {
    const res: IAuthNode[] = [];
    tree.forEach(((id) => {
      const item = getItem(id);
      res.push({
        id, pid: item?.pid, name: item?.name, createType: 'FAST'
      });
    }));
    return res;
  };

  const getMenusListData = async () => {
    // const resModule = await queryMenusListService({
    //   type: MENUS_TYPE.MODULE
    // });

    const resPage = await getPageElementInTreeService({
      type: MENUS_TYPE.MODULE
    });
    setPageFlatTreeData(resPage?.result);

    const resAuth = await findAuthorityInTreeService({
      selectType: 0
    });
    setAuthFlatTreeData(resAuth?.result);

    console.log(resPage?.result);
    console.log(resAuth?.result);

    const tempPageFlatTreeData: IAuthNode[] = [];
    resPage?.result.forEach((pageItem) => {
      const res = pageItem;
      resAuth?.result.forEach((authItem) => {
        if (pageItem.id === authItem.id) {
          Object.assign(res, { disabled: true });
        }
      });
      tempPageFlatTreeData.push(...res);
    });

    console.log(JSON.parse(JSON.stringify(tempPageFlatTreeData)));
    // const a = produce(tempPageFlatTreeData, (d) => d);
    const a = JSON.parse(JSON.stringify(tempPageFlatTreeData));
    const b = JSON.parse(JSON.stringify(tempPageFlatTreeData));

    const leftTree = constructRightTree(a || []);
    console.log(leftTree);

    setLeftTreeData(leftTree);

    // const rightTree = constructRightTree(tempPageFlatTreeData || []);
    const rightTree = constructRightTree(b || []);
    console.log(rightTree);
    setRightTreeData(rightTree);
  };

  useEffect(() => {
    getMenusListData();
  }, []);

  const handleFinish = async (values) => {
    const params = { authorityList: getCodeAndParentCode(checkedRightKeys) };

    const res = await createLesseeAuthorityFastService(params);
    if (res.code === "00000") {
      notification.success({
        message: "新增成功",
        duration: 2
      });
      onOk && onOk();
    } else {
      message.error(res.msg);
    }
  };

  const createModule = () => {
    setVisibleModal(true);
  };

  const handleMenuOk = () => {
    setVisibleModal(false);
    upDataMenus && upDataMenus();
  };
  const handleFormCancel = () => {
    onCancel && onCancel();
  };
  console.log(leftTreeData);
  return (
    <>
      <Row className="data-design-layout">
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="sider-menu-tree">
          <Tree
            checkable
            // onExpand={onLeftExpand}
            // expandedKeys={expandedLeftKeys}
            // autoExpandParent={autoExpandLeftParent}
            onCheck={onLeftCheck}
            checkedKeys={checkedLeftKeys}
            onSelect={onLeftSelect}
            selectedKeys={selectedLeftKeys}

            defaultExpandAll={true}
            style={{ width: '100%' }}
            multiple={true}
            treeData={leftTreeData}

          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="content-pro-table">
          <Tree
            checkable
            // onExpand={onRightExpand}
            // expandedKeys={expandedRightKeys}
            // autoExpandParent={autoExpandRightParent}
            onCheck={onRightCheck}
            checkedKeys={checkedRightKeys}
            onSelect={onRightSelect}
            selectedKeys={selectedRightKeys}

            defaultExpandAll={true}
            style={{ width: '100%' }}
            multiple={true}
            treeData={rightTreeData}
          />
        </Col>

      </Row>

      <Form {...layout} form={form} name="control-hooks" onFinish={handleFinish}>

        <FromFooterBtn
          onCancel={handleFormCancel}
        />
      </Form>
      <CreateModal
        title="新建权限项"
        modalVisible={visibleModal}
        onCancel={() => setVisibleModal(false)}
      >
        <CreateMenu
          onCancel={() => setVisibleModal(false)}
          onOk={handleMenuOk}
        />
      </CreateModal>
    </>
  );
};

export default React.memo(CreateLesseeAuthorityFast);
