/* eslint-disable no-nested-ternary */
import React, {
  useState, useEffect, forwardRef, useImperativeHandle
} from 'react';
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
import { createLesseeAuthorityFastService, queryMenusListService, getPageElementInTreeService } from '../service';
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

  const [expandedLeftKeys, setExpandedLeftKeys] = useState<string[]>(['0-0-0', '0-0-1']);
  const [checkedLeftKeys, setCheckedLeftKeys] = useState<string[]>(["1319197100449341440"]);
  const [selectedLeftKeys, setSelectedLeftKeys] = useState<string[]>([]);
  const [autoExpandLeftParent, setAutoExpandLeftParent] = useState<boolean>(true);

  const [expandedRightKeys, setExpandedRightKeys] = useState<string[]>(['0-0-0', '0-0-1']);
  const [checkedRightKeys, setCheckedRightKeys] = useState<string[]>(["1319197100449341440"]);
  const [selectedRightKeys, setSelectedRightKeys] = useState<string[]>([]);
  const [autoExpandRightParent, setAutoExpandRightParent] = useState<boolean>(true);

  const onLeftExpand = (expandedKeysA) => {
    console.log('onLeftExpand', expandedKeysA);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedLeftKeys(expandedKeysA);
    setExpandedRightKeys(expandedKeysA);
    setAutoExpandLeftParent(false);
  };

  const onLeftCheck = (checkedKeysA) => {
    console.log('onLeftCheck', checkedKeysA);
    setCheckedLeftKeys(checkedKeysA);
    setCheckedRightKeys(checkedKeysA);
  };

  const onLeftSelect = (selectedKeysA, info) => {
    console.log('onLeftSelect', info);
    setSelectedLeftKeys(selectedKeysA);
    setSelectedRightKeys(selectedKeysA);
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

  const constructTree = (data) => {
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

  const getMenusListData = async () => {
    const res = await queryMenusListService({
      type: MENUS_TYPE.MODULE
    });

    const tree = constructTree(res?.result || []);
    setLeftTreeData(tree);
    setRightTreeData(tree);
  };
  // useImperativeHandle(ref, () => ({
  //   reload: () => getMenusListData()
  // }));
  useEffect(() => {
    getMenusListData();
  }, []);

  const handleFinish = async (values) => {
    const params = assemblyParams(values);
    Object.assign(params, { createType: 'CUSTOM' });
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
  /**
   * 创建表接口参数拼装
   * @param values
   */
  const assemblyParams = (values) => {
    const {
      name, code, type, parentCode
    } = values;
    const params = {
      name,
      code,
      type,
      showTypeWithoutAuthority,
      parentCode
    };
    return params;
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

  return (
    <>
      <Row className="data-design-layout">
        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="sider-menu-tree">
          <Tree
            checkable
            onExpand={onLeftExpand}
            expandedKeys={expandedLeftKeys}
            autoExpandParent={autoExpandLeftParent}
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
            onExpand={onRightExpand}
            expandedKeys={expandedRightKeys}
            autoExpandParent={autoExpandRightParent}
            onCheck={onRightCheck}
            checkedKeys={checkedRightKeys}
            onSelect={onRightSelect}
            selectedKeys={selectedRightKeys}

            defaultExpandAll={true}
            style={{ width: '100%' }}
            multiple={true}
            treeData={leftTreeData}
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
