import { NormalCURD } from './CURD';
import { BasicActionConf } from '../action';

export type APBDSLCURDActionType = 'APBDSLCURD';

export interface APBDSLCURDOptions {
  /** apb业务功能码「小的」 */
  businesscode: string;
  /** apbAction列表 */
  actionList: {
    [id: string]: NormalCURD
  }
  /** apbstep执行步骤 */
  actionStep: string[];
}

export interface APBDSLCURD extends BasicActionConf {
  actionType: APBDSLCURDActionType;
  actionOptions: APBDSLCURDOptions;
  actionOutput: 'string';
}

/** APB的功能码 */
export const enum ApbFunction {
  /** 插入 */
  SET = 'TABLE_INSERT',
  /** 更新 */
  UPD = 'TABLE_UPDATE',
  /** 删除 */
  DEL = 'TABLE_DELETE',
  /** 查表 */
  SELECT = 'TABLE_SELECT',
  /** 上传 */
  UPLOAD = 'UPLOAD',
  /** 下载 */
  DOWN = 'DOWNLOAD',
  /** 导入 */
  IMPORT = 'IMPORT_DATA',
  /** 导出 */
  EXPORT = 'EXPORT_TO_FILE',
  /** 自定义返回 */
  RESULT = 'RESULT_RESOLVER'
  /** 第三方业务... 扩展自定义的 */
}
