import { ColumnType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { ITableItem } from './interface';

export const TERMINAL_TYPE_MENU = [
  { label: "CS客户端", value: 'CS', key: 'CS' },
  { label: "BS客户端", value: 'BS', key: 'BS' },
  { label: "手机移动客户端", value: 'PHONE', key: 'PHONE' }
];
export const TABLE_COLUMNS: ColumnType<ITableItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    render: (text, _, index) => index + 1
  },
  {
    title: '权限树名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true
  },
  {
    title: '权限编码',
    dataIndex: 'authorityCode',
    width: 150,
  },
  {
    title: '上级',
    dataIndex: 'parentName',
    ellipsis: true,
    width: 180,
  },
  {
    title: '终端',
    dataIndex: 'terminalType',
    width: 180,
    render: (text) => {
      return TERMINAL_TYPE_MENU.reduce((a, b) => {
        a[b.value] = b.label;
        return a;
      }, {})[text];
    }
  },
  {
    title: '最后修改时间',
    dataIndex: 'gmtModified',
    width: 210,
    render: (date) => {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: '创建人',
    dataIndex: 'createdUserName',
    width: 120
  }
];

export enum API_CODE {
  /** 查表详情成功的 code 值 */
  "SUCCESS" = "00000"
}

export const SELECT_ALL = "all";

export const MORE_MENU = [{
  title: "快速创建权限树",
  key: "createAuthoritySpeedy"
}, {
  title: "自定义创建权限树",
  key: "createAuthority"
}];
export enum MORE_MENU_TYPE {
  "CREATEAUTHORITY" = "createAuthority",
  "CREATEAUTHORITYSPEEDY" = "createAuthoritySpeedy"
}

export enum MESSAGE {
  ALLOW_DELETE_FAILED = '无法删除数据，请联系技术人员',
  NOT_ALLOW_DELETE = '不允许删除',
  MAY_I_DELETE = '请确认是否删除'
}
