export type ITerminalType = 'CS'|'BS'|'PHONE'
export interface ITableItem {
  name: string
  authorityCode: string
  parentName: string
  terminalType: ITerminalType
  gmtModified: number
  createdUserName: string
}
export interface INode {
  title: string | React.ReactElement
  name: string
  key: string
  code: string
  value: string
  parentCode: string
  terminalType: ITerminalType
}
