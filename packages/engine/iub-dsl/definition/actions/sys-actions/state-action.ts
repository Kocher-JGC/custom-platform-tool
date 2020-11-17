import { BasicActionConf } from '../action';

// 改变页面运行时状态 [可对应: 回填、输入、赋值给控件、联动的动作的赋值部分]
const testStruct = {
  type: 'updateState',
  changeTarger: '@(dataCollection).collectId1', // schemas/dataCollect
  changeMapping: {
    '@(metadataMapping).tableId1.filedId1': '@(schema).dId0',
    '@(metadataMapping).tableId1.filedId2': '@(schema).dId1',
    // '@(metadataMapping).tableId1.filedId3': '@(schema).dId3', // TODO?
    '@(metadataMapping).tableId1.filedId3': '@(schema).dId3.sdId1',
    '@(metadataMapping).tableId1.filedId4': '@(schema).dId2',
  },
  when: [],
  conition: {},
};

export type UpdateStateActionType = 'updateState'
/** 动作更新运行时状态、 控件赋值 */

export interface ChangeMapping {
  from: string; // 来源: 固定值, 表达式, 后端数据
  target: string; // 目标: 页面变量的标示位
}

export interface UpdateStateOptions {
  /** 方式1: A To B 的映射 */
  changeMapping?: ChangeMapping[]
  /** 方式2: 根据目标信息, 反向映射「如: schemas的描述/数据收集关系」 */
  changeTarget?: string;
}

export interface UpdateState extends BasicActionConf {
  actionType: UpdateStateActionType;
  actionOptions: UpdateStateOptions
  actionOutput: 'undefined';
}
