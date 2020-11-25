import { BasicActionConf, RefActionOptions } from '../action';

export type InterfaceRequestType = 'interfaceRequest'
/** 动作更新运行时状态、 控件赋值 */

interface InterReqOpts extends RefActionOptions {
  refType: 'inter';
}

/**
 * 接口请求的动作
 */
export interface InterfaceRequest extends BasicActionConf {
  actionType: InterfaceRequestType;
  actionOptions: InterReqOpts;
}