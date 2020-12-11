import PageMetadata from '@spec/page-metadata';
import { WidgetCollection, } from "../widget";
import { ActionCollection } from "../actions/action";
import { FlowCollection } from '../flow';
import { Schema } from "../schema";
import { LayoutContent } from "../layout";
import { PageVariable } from '../page-variable';
import { InterMetaCollection } from '../interface';
/** 公共的hub */
import { ConditionCollection, LowcodeCollection, Ref2ValCollection, InterCollection, APIReqCollection } from '../hub';

export interface PageCommunication {
  pageInfo: {
    pageId: string;
    pageMrak: string;
  }
  /** 元数据信息 */
  metadata: any;
  variableData: PageVariable[];
}

/**
 * 描述页面信息的 DSL
 *
 * TODO: 增加依赖校验
 */
export interface TypeOfIUBDSL extends PageMetadata {
  /** 与 system runtime context 的接口 */
  // sysRtCxtInterface: any;
  /** 关系集合 */
  // relationshipsCollection: any;

  // 以上暂时弃用 2020-11-24

  /** Schema 数据模型 */
  schema: Schema;

  /**
   * 页面所用到的接口的元数据的定义
   */
  interMetaCollection: InterMetaCollection;

  /** 页面生命周期 */
  pageLifecycle: any;

  /** widget集合 */
  widgetCollection: WidgetCollection

  /** 动作集合 */
  actionsCollection: ActionCollection;
  /** 流程集合 */
  flowCollection: FlowCollection;

  /** 布局信息 */
  layoutContent: any; // LayoutContent;
  /** hub 可以在适当的业务节点动态插入的抽象公共提取 --------- Start */
  
  /** 公共条件描述 */
  conditionCollection: ConditionCollection;
  /** 数据转换的描述配置「获取值/赋值」  */
  ref2ValCollection: Ref2ValCollection;
  /** 低代码的描述 */
  lowcodeCollection: LowcodeCollection;
  /** 页面所有接口请求的配置的描述 */
  APIReqCollection: APIReqCollection;
  
  /** hub 可以在适当的业务节点动态插入的抽象公共提取 --------- end */

  /** 临时结构 */
  openPageUrl: string; // TODO: TEMP
  isSearch: boolean;
  businessCode: string[];
}
