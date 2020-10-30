import React, { PureComponent } from 'react';
import {
  Table, Input, Button, Menu, Dropdown
} from 'antd';
import { ColumnType } from 'antd/lib/table';
import { DownOutlined } from '@ant-design/icons';
import { getShowAuthorities } from '../services/apiAgents';
import { ITableItem } from '../interface';
import { TABLE_COLUMNS, MORE_MENU } from '../constants';

interface IProps {
  authorities: string[]
}

interface IState {
  pageOffset: number
  pageSize: number
  searchArea: string
  list: ITableItem[]
  total: number
}
class AuthorityList extends PureComponent<IProps, IState> {
  state = {
    pageOffset: 0,
    pageSize: 10,
    searchArea: '',
    list: [],
    total: 0
  }

  componentWillMount() {
    this.getList();
  }

  getList = () => {
    const {
      pageOffset, pageSize, searchArea
    } = this.state;
    // const { authorities } = this.props;
    getShowAuthorities({
      // authorities,
      showAuthorityName: searchArea,
      authorityCode: searchArea,
      offset: pageOffset * pageSize,
      size: pageSize
    }).then((res) => {
      this.setState({
        list: res.data,
        total: res.total
      });
    });
  }

  getColumns = (): ColumnType<ITableItem>[] => [
    ...TABLE_COLUMNS,
    {
      title: '操作',
      dataIndex: "action",
      fixed: "right",
      width: 160,
      render: (text, record) => (
        <>
          <span
            className="link-btn mr-4"
            onClick={(e) => { this.handleEdit(record); }}
          >编辑</span>
          <span
            className="link-btn"
            onClick={(e) => { this.handleDelete(record); }}
          >删除</span>
        </>
      )
    },
  ];

  handleEdit = (record) => {

  }

  handleDelete = (record) => {

  }

  handleSearch = (value) => {

  }

  handleCreateAuthority = () => {

  }

  handleCreateAuthoritySpeedy = () => {

  }

  handlePageSizeChange = (current, size) => {

  }

  handleMenuClick = ({ key }) => {
    if (key === "createAuthority") {

    } else if (key === "createAuthoritySpeedy") {

    }
  };

  columns = this.getColumns()

  renderMenu = () => <Menu onClick={this.handleMenuClick}>
    {
      MORE_MENU.map((item) => <Menu.Item key={item.key} >
        {item.title}
      </Menu.Item>)
    }
  </Menu>;

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
export default AuthorityList;
