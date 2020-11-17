import { UpdateStateOptions } from "@iub-dsl/definition/actions";
import { ActionDoFn } from "../types";
import { DispatchModuleName, DispatchMethodNameOfIUBStore } from "../../runtime/types";

/**
 * 最重要的问题: 流程和隔离
 * 单个action和多个action
 * 事件触发、标准输入「action输入是标准输入」
 * 1. 需要用到标准输入得, 不需要用到标准输入得
 * 2. 配置流程中的上下文的「流程引擎中识别」
 */
export const updateStateAction = (conf: UpdateStateOptions, baseActionInfo): ActionDoFn => {
  // 更新状态动作的配置和定义
  const {
    changeTarget,
    changeMapping
  } = conf;
  /** 在Action接收payload直接点对点改变数据 */
  if (changeTarget) {
    return async ({ action, asyncDispatchOfIUBEngine }) => {
      return await asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.targetUpdateState,
          params: [changeTarget, action.payload],
        },
        actionInfo: action,
      });
    };
  }
  /**
   * 映射结构的改变
   * from: 表达式, 固定值,
   * target: 某个页面变量的标志位 「特殊(其他动作的职能): 如:联动 username将转成 @(schema).dId1」
   * 问题: dId2[1]/sdId2, 层级的描述和转换, 放在哪?
   */
  if (changeMapping) {
    // {@(schema).did1: val}
    return async ({ action, asyncDispatchOfIUBEngine }) => {
      // const A = {
      //   did1: 1,
      //   did2: 2,
      //   'dataSource[1]/username': 3,
      //   'department[2]/children[3]/deparmentName': 1,
      // };
      const actualChangeMapping = changeMapping.map(async ({ from: oldFrom, target }) => {
        /** from的转换, 比如表达式的运算 */
        const from = oldFrom;
        // const from = await asyncDispatchOfIUBEngine({
        //   /** 不确定的模块进行模糊调度来求值 */
        //   dispatch: { // TODO: 未开发
        //     module: DispatchModuleName.IUBStore,
        //     method: DispatchMethodNameOfIUBStore.updatePageState,
        //     params: [oldFrom],
        //   }
        // });

        return { from, target };
      });
      return await asyncDispatchOfIUBEngine({
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.mappingUpdateState,
          params: [actualChangeMapping],
        },
        actionInfo: action,
      });
    };
  }
  return async () => {
  };
};
