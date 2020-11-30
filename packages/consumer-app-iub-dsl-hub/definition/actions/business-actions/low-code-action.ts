import { BasicActionConf, RefActionOptions } from '../action';

export type LowcodeType = 'lowcode'
/** 动作更新运行时状态、 控件赋值 */

interface LowcodeOpts extends RefActionOptions {
  refType: 'lowcode';
}

/**
 * 接口请求的动作
 */
export interface LowcodeAction extends BasicActionConf {
  actionType: LowcodeType;
  actionOptions: LowcodeOpts;
}