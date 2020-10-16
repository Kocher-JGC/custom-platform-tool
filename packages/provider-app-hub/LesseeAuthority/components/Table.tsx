import React, { useRef, useState, useEffect } from 'react';
import ProLesseeAuthority, { ProColumns } from '@hy/pro-table';
import {
  Button, Modal, notification, Dropdown, Menu
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import { onNavigate } from 'multiple-page-routing';
import { queryLesseeAuthorityListService, allowDeleteLesseeAuthorityService, deleteLesseeAuthorityService } from '../service';
import {
  COLUMNS, OPERATIONALMENU, SELECT_ALL, MORE_MENU, PAGE_SIZE_OPTIONS
} from '../constant';
import Operational from './Operational';
import { IStatus } from '../interface';
import CreateModal from './CreateModal';
import CreateLesseeAuthority from './CreateLesseeAuthority';
import CopyLesseeAuthority from './CopyLesseeAuthority';

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

const LesseeAuthority: React.FC<IProps> = (props: IProps, ref) => {
  let moduleId = "";
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const [copyData = {}, setCopyData] = useState<ICopyData>();
  const [visibleCopyModal, setVisibleCopyModal] = useState<boolean>(false);
  const [visibleCrateLesseeAuthorityModal, setVisibleCrateLesseeAuthorityModal] = useState<boolean>(false);

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
    if (key === "dictionary") {
      onNavigate({
        type: "PUSH",
        path: '/DictManage',
      });
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
  const handleLesseeAuthorityOperational = async (item) => {
    const {
      operate, id, name, code
    } = item;
    if (operate === "edit") {
      onNavigate({
        type: "PUSH",
        path: `/LesseeAuthority-editor`,
        pathExtend: id,
        params: { id, title: `编辑表_${name}` }
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
  const handleCratetLesseeAuthorityOk = () => {
    setVisibleCrateLesseeAuthorityModal(false);
    proLesseeAuthorityReload();
  };
  const handleCopyLesseeAuthorityOk = () => {
    setVisibleCopyModal(false);
    proLesseeAuthorityReload();
  };
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
    <Button key="3" type="primary" onClick={() => setVisibleCrateLesseeAuthorityModal(true)}>
      新建表
    </Button>,
    <Dropdown overlay={renderMenu}>
      <Button type="primary">
        更多按钮 <DownOutlined />
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
        title="新建数据表"
        modalVisible={visibleCrateLesseeAuthorityModal}
        onCancel={() => setVisibleCrateLesseeAuthorityModal(false)}
      >
        <CreateLesseeAuthority
          onOk={handleCratetLesseeAuthorityOk}
          onCancel={() => setVisibleCrateLesseeAuthorityModal(false)}
          upDataMenus={handleUpdataMenus}
        />
      </CreateModal>
      <CreateModal
        title="复制数据表"
        modalVisible={visibleCopyModal}
        onCancel={() => setVisibleCopyModal(false)}
      >
        <CopyLesseeAuthority
          data={copyData}
          onOk={handleCopyLesseeAuthorityOk}
          onCancel={() => setVisibleCopyModal(false)}
        />
      </CreateModal>
    </>
  );
};

export default React.memo(LesseeAuthority);
