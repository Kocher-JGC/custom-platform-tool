import {
  DataCollectionOptions,
  BaseCollectionStruct,
} from "@iub-dsl/definition/actions";
import {
  DispatchModuleName,
  DispatchMethodNameOfIUBStore,
  DispatchMethodNameOfDatasourceMeta
} from "../../runtime/types";
import { ActionDoFn } from "../types";

export const dataCollectionAction = (conf: DataCollectionOptions, baseActionInfo: any = {}): ActionDoFn => {
  const { collectionType, struct } = conf;
  if (collectionType === 'structArray') {
    return async ({ action, asyncDispatchOfIUBEngine }) => {
      return await asyncDispatchOfIUBEngine({
        actionInfo: baseActionInfo,
        dispatch: {
          module: DispatchModuleName.IUBStore,
          method: DispatchMethodNameOfIUBStore.getPageState,
          params: [struct]
        }
      });
    };
  }
  /**
   * structObject
   * 1. pageState中字段的映射 collectField 「含有运行时状态、表达式」
   * 2. 映射成元数据形式 field
   * 3. 固定映射 aliasField
   */
  return async ({ action, asyncDispatchOfIUBEngine, dispatchOfIUBEngine }) => {
    const newStruct = genGetPagetStateStruct(struct, dispatchOfIUBEngine);
    return await asyncDispatchOfIUBEngine({
      actionInfo: baseActionInfo,
      dispatch: {
        module: DispatchModuleName.IUBStore,
        method: DispatchMethodNameOfIUBStore.getPageState,
        params: [newStruct]
      }
    });
  };
};

const genGetPagetStateStruct = (struct: (string | BaseCollectionStruct)[], dispatchOfIUBEngine) => {
  return struct.reduce(((result, sInfo: (string | BaseCollectionStruct)) => {
    if (typeof sInfo === 'string') {
      result[sInfo] = sInfo;
    } else {
      const { aliasField, field, collectField } = sInfo;
      if (collectField !== undefined) {
        /** TODO: aliasField和field 的优先级问题 */
        if (field !== undefined) {
          const fieldCode = dispatchOfIUBEngine({
            dispatch: {
              module: DispatchModuleName.datasourceMeta,
              method: DispatchMethodNameOfDatasourceMeta.getFiledCode,
              params: [field]
            }
          });
          if (fieldCode) {
            result[fieldCode] = collectField;
          } else {
            console.error('数据源映射转换失败!!', fieldCode);
            result[field] = collectField;
          }
        } else if (aliasField !== undefined) {
          result[aliasField] = collectField;
        }
      } else {
        console.error('收集结构信息错误无收集字段信息: collectField');
      }
    }
    return result;
  }), {});
};
