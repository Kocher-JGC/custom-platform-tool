export interface BasicActionConf {
  /** 动作Id */
  actionId: string;
  /** 动作名字 */
  actionName: string;
  /** 动作的类型 */
  actionType: string;
  /** 不同动作的配置 */
  actionOptions: any;
  // actionOutput?: 'ActionOutput';
  condition?: string;
}

/**
 * APBDSL的所有函数功能码
 */
export const enum FuncCodeOfAPB {
  /** 普通 */
  C = 'TABLE_INSERT',
  U = 'TABLE_UPDATE',
  R = 'TABLE_SELECT',
  D = 'TABLE_DELETE',
  /** 特殊功能码 */
  ResResolve = 'RESULT_RESOLVER',
  /** 函数功能码 */
  ID = 'ID',
  SysUser = 'SYSTEM_USER',
  Now = 'NOW',
}