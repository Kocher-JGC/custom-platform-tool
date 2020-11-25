import { BasicActionConf } from '../action';
import { Ref2ValueOfObj } from '../../hub';
/**
 * 设置值时, 必须是对象 ComplexType.structObject
 * 对于 IUBStore.set时候而言 key:value 都是固定的
 * 但是实际情况
 * key: username/@(meta)/@(payload)/@(schema) 「key一般都是配置的」
 * value: '张三'/lowCode/exp/@(payload)
 */

/** 
 * 值应该是有一个源的
 * 不同源应该有自己的对应规则
 * 1. 选择器: 值+schema+interMeta
 * 2. OnChange: 值+schema
 * 3. Config: conf+[值/选择形式的(弹窗选择)]
*/
enum ValueSource {
  Selector = 'Selector', // 选择器产生的「下拉/选择框」 「额外: 穿梭/表格选择/树形选择」
  OnChange = 'OnChange', // 用户OnChange
  Config = 'Config', // 控件赋值/联动/传入值/传出值/弹窗选择+Selector[显示实际、等]/
}

export type ChangeStateType = 'changeState'
/** 动作更新运行时状态、 控件赋值 */

// from: string; // 来源: 固定值, 表达式, 后端数据
// target: string; // 目标: 页面变量的标示位
export type ChangeMapping = Ref2ValueOfObj;

/**
 * 1. 单个值修改
 * 2. 有规律的值的修改 Ref2ValueOfComplex
 */
export interface UpdateStateOptions {
  /** 方式1: A To B 的映射 */
  changeMapping?: ChangeMapping;
  /** 方式2: 根据目标信息, 反向映射「如: schemas的描述/数据收集关系」 */
  // changeTarget?: string;
}

export interface ChangeState extends BasicActionConf {
  actionType: ChangeStateType;
  actionOptions: UpdateStateOptions;
}
