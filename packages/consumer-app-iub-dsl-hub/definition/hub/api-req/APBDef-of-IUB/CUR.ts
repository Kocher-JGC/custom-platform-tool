import { refIdOfCondition, refIdOfRef2Value } from '@iub-dsl/definition';
import { FuncCodeOfAPB, BaseAPBDef } from "../api-req-of-APB";

/**
 * APBDSL CURD 的定义
 */


/**
 * 新增功能的定义
 */
export interface CreateDef extends BaseAPBDef {
  funcCode: FuncCodeOfAPB.C;
  set: refIdOfRef2Value;
}

/**
 * 更新功能的定义
 */
export interface UpdateDef extends BaseAPBDef {
  funcCode: FuncCodeOfAPB.U;
  condition: refIdOfCondition;
  set: refIdOfRef2Value;
}

/**
 * 删除
 */
export interface DeleteDef extends BaseAPBDef {
  funcCode: FuncCodeOfAPB.D;
  condition: refIdOfCondition;
}
