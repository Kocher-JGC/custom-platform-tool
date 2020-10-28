// {
//   actionType: 'showMoadl';
//   actionOptions?: any;
//   actionName: string
//   actionOutput?: any;
//   actionId: string;
// }

import { BasicActionConf } from '../action';

interface IUBDSLModal {

  type: 'iub-dsl';
  pageUrl: string;

}

export type OpenModalActionType = 'openModal'
/** 动作更新运行时状态、 控件赋值 */
export interface OpenModal extends BasicActionConf {
  actionType: OpenModalActionType;
  actionOptions: IUBDSLModal;
  actionOutput: 'undefined';
}

export type OpenModalFromTableClickType = 'openModalFromTableClick'

export interface OpenModalFromTableClick extends BasicActionConf {
  actionType: OpenModalFromTableClickType;
  actionOptions: {
    pageUrl: string;
  };
  actionOutput: 'undefined';
}
