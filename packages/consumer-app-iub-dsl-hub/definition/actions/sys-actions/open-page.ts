// {
//   actionType: 'showMoadl';
//   actionOptions?: any;
//   actionName: string
//   actionOutput?: any;
//   actionId: string;
// }

import { BasicActionConf } from '../action';
import { CommonConditionRef } from '../../hub';

/** 打开类型「model/page/_blank」 */
export enum OpenType {
  modal = 'modal',
}
/** 打开的页面类型 */
export enum PageType {
  IUBDSL = 'IUBDSL'
}


export interface OpenPageOptions {
  openType: OpenType;
  pageType: PageType;
  pageUrl: string;
  emitConf?: { // 传入的配置
    condition: CommonConditionRef;
  }
}

export type OpenPageActionType = 'openPage'
/** 动作更新运行时状态、 控件赋值 */
export interface OpenPage extends BasicActionConf {
  actionType: OpenPageActionType;
  actionOptions: OpenPageOptions;
}

export type OpenPageFromTableClickType = 'openPageFromTableClick'

export interface OpenPageFromTableClick extends BasicActionConf {
  actionType: OpenPageFromTableClickType;

  actionOptions: OpenPageOptions;
  // 传入的变量映射 [扩展: 回填弹窗选择]
  // emitVar?: {}
}
