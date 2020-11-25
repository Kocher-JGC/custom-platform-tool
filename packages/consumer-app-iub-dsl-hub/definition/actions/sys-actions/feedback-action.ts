import { BasicActionConf } from "../action";

type FeedBackStatus = 'success' | 'faile'

export type FeedBackType = 'openModal'
/** 动作更新运行时状态、 控件赋值 */
export interface FeedBack extends BasicActionConf {
  actionType: FeedBackType;
  actionOptions: {
    status: FeedBackStatus;
    msg: string; 
  };
}
