/*
 * @Author: your name
 * @Date: 2020-07-06 15:44:28
 * @LastEditTime: 2020-07-31 16:37:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \custom-platform-v3-frontend\packages\infrastructure\utils\utils.ts
 */
import { notification } from 'antd';

/** 弹窗参数类型约束 */
export type alertMsgArgs={
  type?:'open'|'success'|'warning'|'info'|'error';
  title:string;
  desc?:string;
  duration?:number;
}
/**
 * 弹出通知提醒框
 * @param type  弹窗类型
 * @param title  标题
 * @param desc 详细描述
 * @param duration 提醒框显示时间
 */
export function alertMsg(params:alertMsgArgs) {
  const {
    title, type, desc, duration
  } = params;
  const args = {
    message: title || '',
    description: desc || '',
    duration: duration || 3,
    showIcon: true
  };

  notification[type || 'open'](args);
  return args;
}
