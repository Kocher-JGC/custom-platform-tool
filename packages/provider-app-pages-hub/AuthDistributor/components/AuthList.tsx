import React, { PureComponent } from 'react';
import {
  Table, Input, Button, Menu, Dropdown, message, Modal
} from 'antd';
import { ColumnType } from 'antd/lib/table';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CloseModal, ShowModal } from "@infra/ui";
import {
  batchCreateAuth, deleteShowAuthItem, getShowAuthorities, createShowAuth, updateShowAuth, getShowAuthDetail, allowDeleteShowAuth
} from '../services/apiAgents';
import { ITableItem } from '../interface';
import {
  TABLE_COLUMNS, MORE_MENU, MORE_MENU_TYPE, TEMINAL_TYPE
} from '../constants';
import { CreateAuth, BatchCreateAuth } from '../pages';

interface IProps {
  authorities: string[]
  handleUpdateShowTree: ()=>void
}

interface IState {
  offset: number
  size: number
  searchArea: string
  list: ITableItem[]
  total: number
}
/**
 * 权限展示数据列表
 * @param props
 */
class AuthList extends PureComponent<IProps, IState> {
  state = {
    offset: 0,
    size: 10,
    searchArea: '',
    list: [],
    total: 0
  }

  componentWillMount() {
    this.getList();
  }

  componentWillReceiveProps(nextProps) {
    this.getList(nextProps);
  }

  /**
   * 列表数据获取
   */
  getList = (props?: IProps) => {
    const {
      offset, size, searchArea
    } = this.state;
    props = props || this.props;
    const { authorities } = props;
    const param = {
      showAuthorityName: searchArea,
      keyWord: searchArea,
      offset: offset * size,
      size
    };
    if (authorities?.length > 0) {
      Object.assign(param, { code: authorities.join(',') });
    }
    getShowAuthorities(param).then((res) => {
      this.setState({
        list: res.data,
        total: res.total
      });
    });
  }

  /**
   * 展示列数据构造
   */
  getColumns = (): ColumnType<ITableItem>[] => [
    ...TABLE_COLUMNS,
    {
      title: '操作',
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: 160,
      render: (text, record) => (
        <>
          <span
            key = "edit"
            className="link-btn mr-4"
            onClick={(e) => { this.handleEdit(record); }}
          >编辑</span>
          <span
            className="link-btn"
            key = "delete"
            onClick={(e) => { this.handleDelete(record); }}
          >删除</span>
        </>
      )
    },
  ];

  /**
   * 编辑权限展示
   * @param param0
   */
  handleEdit = async ({ id }) => {
    const authData = await getShowAuthDetail({ id });
    const modalID = ShowModal({
      title: '编辑权限展示树',
      width: 600,
      children: () => {
        return (
          <div className="p20">
            <CreateAuth
              authData = {authData}
              onSuccess={(authDataModal) => {
                updateShowAuth(authDataModal).then((canIupdate) => {
                  if (!canIupdate) return;
                  CloseModal(modalID);
                  this.getList();
                  this.props.handleUpdateShowTree();
                });
              }}
              onCancel={() => {
                CloseModal(modalID);
              }}
            />
          </div>
        );
      }
    });
  }

  /**
   * 删除权限展示
   * @param param0
   */
  handleDelete = ({ id }) => {
    allowDeleteShowAuth({ id }).then(({ allowDelete, title }) => {
      if (!allowDelete) {
        message.error(title);
        return;
      }
      /** 允许删除 */
      Modal.confirm({
        title,
        icon: <ExclamationCircleOutlined />,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          deleteShowAuthItem({ id }).then((canIDelete) => {
            if (!canIDelete) return;
            this.getList();
            this.props.handleUpdateShowTree();
          });
        }
      });
    });
  }

  /**
   * 支持搜索
   * @param value
   */
  handleSearch = (value) => {
    this.setState({
      searchArea: value
    }, () => {
      this.getList();
    });
  }

  /**
   * 创建权限展示
   */
  handleCreateShowAuth = () => {
    const modalID = ShowModal({
      title: '创建权限展示树',
      width: 600,
      children: () => {
        return (
          <div className="p20">
            <CreateAuth
              onSuccess={(authData) => {
                createShowAuth(authData).then((canICreate) => {
                  if (!canICreate) return;
                  CloseModal(modalID);
                  /** 刷新列表 */
                  this.getList();
                  /** 刷新外部权限展示树 */
                  this.props.handleUpdateShowTree();
                });
              }}
              onCancel={() => {
                CloseModal(modalID);
              }}
              authData = {{ terminalType: TEMINAL_TYPE.BS }}
            />
          </div>
        );
      }
    });
  }

  /**
   * 批量创建权限展示
   */
  handleBatchCreateShowAuth = () => {
    const modalID = ShowModal({
      title: '生成权限展示树',
      width: 700,
      children: () => {
        return (
          <div className="p20">
            <BatchCreateAuth
              onSuccess={(authData) => {
                batchCreateAuth(authData).then((canIBatchCreate) => {
                  if (!canIBatchCreate) return;
                  CloseModal(modalID);
                  /** 刷新列表 */
                  this.getList();
                  /** 刷新外部权限展示树 */
                  this.props.handleUpdateShowTree();
                });
              }}
              onCancel={() => {
                CloseModal(modalID);
              }}
            />
          </div>
        );
      }
    });
  }

  handlePageSizeChange = (offset, size) => {
    this.setState({
      offset: offset - 1, size
    }, () => {
      this.getList();
    });
  }

  /**
   * 操作列的操作
   * @param param0
   */
  handleMenuClick = ({ key }) => {
    if (key === MORE_MENU_TYPE.CREATEAUTHORITY) {
      /** 自定义创建权限 */
      this.handleCreateShowAuth();
    } else if (key === MORE_MENU_TYPE.CREATEAUTHORITYSPEEDY) {
      /** 批量创建权限 */
      this.handleBatchCreateShowAuth();
    }
  };

  columns = this.getColumns()

  /** 按钮下拉项渲染 */
  renderMenu = () => (
    <Menu onClick={this.handleMenuClick}>
      {
        MORE_MENU.map((item) => <Menu.Item key={item.key} >
          {item.title}
        </Menu.Item>)
      }
    </Menu>
  );

  render() {
    const { list, total } = this.state;
    return (
      <>
        <div className="w-2/5 mb-4">
          <Input.Search
            placeholder="请输入权限树名称或编码"
            allowClear
            enterButton="搜索"
            size="middle"
            onSearch={this.handleSearch}
          />
        </div>
        <div className="t-header flex">
          <div className="title">权限项管理</div>
          <span className="flex"></span>
          <div className="action-area">
            <Dropdown overlay={this.renderMenu}>
              <Button type="primary" size="middle">
              创建权限树 <DownOutlined />
              </Button>
            </Dropdown>
          </div>
        </div>
        <Table
          rowKey='id'
          dataSource = {list}
          columns = {this.columns}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
            total,
            onChange: this.handlePageSizeChange,
            onShowSizeChange: this.handlePageSizeChange,
            showSizeChanger: true
          }}
        />
      </>
    );
  }
}
export default React.memo(AuthList);
