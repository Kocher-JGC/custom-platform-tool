import { DataNode as TreeNode } from 'antd/lib/tree';

export type ITerminalType = 'CS'|'BS'|'PHONE';
export interface ITableItem {
  name: string
  authorityCode: string
  parentName: string
  terminalType: ITerminalType
  gmtModified: number
  createdUserName: string
}
export interface INode extends TreeNode{
  title: string | React.ReactElement
  name: string
  key: React.Key
  uniqueId: React.Key
  value: string
  parentUniqueId: React.Key
  terminalType?: ITerminalType
  children?: INode[]
  attachment?: {
    binding?: boolean
    authorityId?: string
  }
  canBeDeleted?: boolean
}

export interface INodeConfig {
  columnImg: {
    uniqueId: string
    parentUniqueId: string
    value: string
    name: string
  }
  titleBeautifyBySearchValue?:boolean
}
