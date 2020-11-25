import { CommonConditionRef } from "../hub";
import { ComplexType } from '../schema';
import {
  ChangeState, ChangeStateType,
  OpenPageActionType, OpenPage,
  OpenPageFromTableClickType, OpenPageFromTableClick, 
  FeedBackType, FeedBack
} from "./sys-actions";
import { 
  APBDSLCURD, APBDSLCURDActionType,
  LinkageType, Linkage,
  InterfaceRequestType, InterfaceRequest,
  LowcodeType, Lowcode,
} from './business-actions';

type  RefActionType = 'lowcode' | 'inter'

/**
 * 引用的形态的动作配置
 * 如: 低代码的引用为@(lowcode).XXX 、 接口请求的应用为 @(inter).XXX
 */
export interface RefActionOptions {
  refType: RefActionType;
  ref: string;
}

/**
 * 基础动作配置
 */
export interface BasicActionConf {
  /** 动作Id */
  actionId: string;
  /** 动作名字 */
  actionName: string;
  /** 动作的类型 */
  actionType: AllActionType;
  /** 不同动作的配置 */
  actionOptions: any;
  /** 单个动作的输出, TODO: 实际如何使用 */
  actionOutput?: ActionOutput;
  condition?: CommonConditionRef
}

/** 
 * 系统相关动作类型
 */
type SysActionType =
  ChangeStateType |
  FeedBackType | 
  OpenPageActionType |
  OpenPageFromTableClickType;

/**
 * 业务相关动作类型
 */
type BusinessActionType =
  APBDSLCURDActionType |
  InterfaceRequestType | 
  LowcodeType |
  LinkageType

/**
 * 所有动作类型
 */
export type AllActionType = SysActionType | BusinessActionType

/**
 * 所有动作的定义
 */
export type ActionDef = 
  OpenPage | ChangeState | InterfaceRequest | Lowcode |
  FeedBack | APBDSLCURD | OpenPageFromTableClick | Linkage
export type ActionOutput = any; // 'string' | 'boolean' | 'undefined' | 'number' | FlowOutputOfObj;

export interface FlowOutputOfObj {
  type: ComplexType;
  struct: {key: string; val: string}[]
  // struct: {from: string; to: string}[]
}

export interface ActionCollection {
  [actionId: string]: ActionDef
}
