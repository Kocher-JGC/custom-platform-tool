import React, { useRef, useState, useEffect } from 'react';
import ProLesseeAuthority, { ProColumns } from '@hy/pro-table';
import {
  Button, Modal, notification, Dropdown, Menu
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import {
  queryLesseeAuthorityListService, allowDeleteLesseeAuthorityService,
  deleteLesseeAuthorityService, queryLesseeAuthorityService
} from '../service';
import {
  COLUMNS, OPERATIONALMENU, SELECT_ALL, MORE_MENU, PAGE_SIZE_OPTIONS, IModalData
} from '../constant';
import Operational from './Operational';
import { IStatus } from '../interface';
import CreateModal from './CreateModal';
import CreateLesseeAuthorityCustom from './CreateLesseeAuthorityCustom';
import CreateLesseeAuthorityFast from './CreateLesseeAuthorityFast';

const { confirm } = Modal;

interface IProps {
  moduleId: string;
  updataMenus: () => void;
}
interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

export interface ICopyData {
  id?: string;
  name?: string;
  code?: string;
}

export interface ILesseeAuthority {
  id?: string;
  name?: string;
  code?: string;
}

const LesseeAuthority: React.FC<IProps> = (props: IProps, ref) => {
  let moduleId = "";
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [copyData = {}, setCopyData] = useState<ICopyData>();
  const [visibleCopyModal, setVisibleCopyModal] = useState<boolean>(false);
  const [visibleFastLesseeAuthorityModal, setVisibleFastLesseeAuthorityModal] = useState<boolean>(false);
  const [visibleCustomLesseeAuthorityModal, setVisibleCustomLesseeAuthorityModal] = useState<boolean>(false);
  const [editData = {}, setEditData] = useState<ILesseeAuthority>();
  const [editModalData = {}, setEditModalData] = useState<IModalData>();

  const LesseeAuthorityOperational: ProColumns = {
    title: '操作',
    dataIndex: 'operCol',
    fixed: 'right',
    hideInSearch: true,
    width: OPERATIONALMENU.length * 80,
    render: (row, record, index) => <Operational data={record} onClick={handleLesseeAuthorityOperational} />
  };
  const columns = [...COLUMNS, LesseeAuthorityOperational];
  useEffect(() => {
    if (props.moduleId) {
      moduleId = props.moduleId === SELECT_ALL ? "" : props.moduleId;
      proLesseeAuthorityReset();
      fromReset();
    }
  }, [props.moduleId]);
  const handleMenuClick = ({ key }) => {
    console.dir(key);
    if (key === "fast_create_lessee_authority") {
      setVisibleFastLesseeAuthorityModal(true);
    }
    if (key === "custom_create_lessee_authority") {
      setVisibleCustomLesseeAuthorityModal(true);
    }
  };
  const getData = async (params, sorter, filter) => {
    const { current, pageSize } = params;
    const LesseeAuthorityParmas = {
      ...params,
      offset: (current - 1) * pageSize || 0,
      size: pageSize || 10,
      moduleId
    };
    const res = await queryLesseeAuthorityListService(LesseeAuthorityParmas);
    const { data, total } = res.result;
    return Promise.resolve({
      data: data || [],
      success: true,
      total: total || 0
    });
  };
  const getInitEditPopupWinndow = () => {
    return null;
  };
  const handleLesseeAuthorityOperational = async (item) => {
    const {
      operate, id, name, code
    } = item;
    if (operate === "edit") {
      if (!id) {
        return;
      }
      queryLesseeAuthorityService(id).then((res) => {
      /** 如果接口没有提供提示信息 */
        if (!res?.msg) {
          openNotification('error', 'data error');
        }
        setEditModalData({ modalTitle: '编辑弹窗', okText: '保存', });
        const initEditData = getInitEditPopupWinndow();
        const retEditData = res?.result;

        if (!res?.result.tablePopupWindowDetail) {
          retEditData.tablePopupWindowDetail = initEditData.tablePopupWindowDetail;
        }
        if (!res?.result.treePopupWindowDetail) {
          retEditData.treePopupWindowDetail = initEditData.treePopupWindowDetail;
        }
        if (!res?.result.treeTablePopupWindowDetail) {
          retEditData.treeTablePopupWindowDetail = initEditData.treeTablePopupWindowDetail;
        }

        console.log(retEditData);
        // temp = Object.assign(temp, res?.result);
        setEditData(retEditData);
        // setEditData(res?.result);
        setVisibleCustomLesseeAuthorityModal(true);
      });
    } else if (operate === "delete") {
      checkBeforeDelete(id);
    } else if (operate === "copy") {
      setCopyData({ id, name, code });
      setVisibleCopyModal(true);
    }
  };
  const checkBeforeDelete = async (id: string) => {
    const res = await allowDeleteLesseeAuthorityService(id);
    if (res.code === "00000") {
      if (res.result) {
        confirm({
          title: res.result,
          icon: <ExclamationCircleOutlined />,
          okText: '确定',
          cancelText: '取消',
          onOk: () => { deleteLesseeAuthoritySingleLine(id); }
        });
      } else {
        deleteLesseeAuthoritySingleLine(id);
      }
    } else {
      openNotification("error", res.msg);
    }
  };
  const deleteLesseeAuthoritySingleLine = async (id: string) => {
    const res = await deleteLesseeAuthorityService(id);
    if (res.code === "00000") {
      openNotification("success", "删除成功");
      proLesseeAuthorityReload();
    } else {
      openNotification("error", "删除失败");
    }
  };
  const openNotification = (type: IStatus, msg = "", description = "") => {
    notification[type]({
      message: msg,
      description
    });
  };
  const proLesseeAuthorityReload = () => {
    actionRef?.current?.reload();
  };
  const proLesseeAuthorityReset = () => {
    actionRef?.current?.reload();
  };
  const fromReset = () => {
    formRef.current?.resetFields();
  };
  const handleFastLesseeAuthorityOk = () => {
    setVisibleFastLesseeAuthorityModal(false);
    proLesseeAuthorityReload();
  };
  const handleCustomLesseeAuthorityOk = () => {
    setVisibleCustomLesseeAuthorityModal(false);
    proLesseeAuthorityReload();
  };
  // const handleCopyLesseeAuthorityOk = () => {
  //   setVisibleCopyModal(false);
  //   proLesseeAuthorityReload();
  // };
  const handleUpdataMenus = () => {
    props.updataMenus && props.updataMenus();
  };
  const renderMenu = () => <Menu onClick={handleMenuClick}>
    {
      MORE_MENU.map((item) => <Menu.Item key={item.key} >
        {item.title}
      </Menu.Item>)
    }
  </Menu>;
  const renderToolBarRender = () => [
    <Button key="3" type="primary" onClick={() => setVisibleCustomLesseeAuthorityModal(true)}>
      新建权限项
    </Button>,
    <Dropdown overlay={renderMenu}>
      <Button type="primary">
      新建权限项 <DownOutlined />
      </Button>
    </Dropdown>
  ];
  return (
    <>
      <ProLesseeAuthority
        request={getData}
        search={{
          searchText: "搜索",
          resetText: "清空",
          collapsed: false,
          collapseRender: () => ""
        }}
        actionRef={actionRef}
        formRef={formRef}
        columns={columns}
        rowKey="id"
        scroll={{ x: '500px' }}
        toolBarRender={renderToolBarRender}
        pagination={{
          hideOnSinglePage: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS
        }}
      />
      <CreateModal
        title="自定义创建权限项"
        modalVisible={visibleCustomLesseeAuthorityModal}
        onCancel={() => setVisibleCustomLesseeAuthorityModal(false)}
      >
        <CreateLesseeAuthorityCustom
          onOk={handleCustomLesseeAuthorityOk}
          onCancel={() => setVisibleCustomLesseeAuthorityModal(false)}
          upDataMenus={handleUpdataMenus}
        />
      </CreateModal>
      <CreateModal
        title="快速创建权限项"
        modalVisible={visibleFastLesseeAuthorityModal}
        onCancel={() => setVisibleFastLesseeAuthorityModal(false)}
      >
        <CreateLesseeAuthorityFast
          onOk={handleFastLesseeAuthorityOk}
          onCancel={() => setVisibleFastLesseeAuthorityModal(false)}
          upDataMenus={handleUpdataMenus}
        />
      </CreateModal>
    </>
  );
};

export default React.memo(LesseeAuthority);
