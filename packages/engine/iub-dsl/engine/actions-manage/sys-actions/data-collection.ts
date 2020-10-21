import {
  DataCollection,
  BaseCollectionStruct,
} from "@iub-dsl/definition/actions";

export const dataCollectionAction = (conf: DataCollection) => {
  const { actionName, collectionType, struct } = conf;
  if (collectionType === 'structArray') {
    return (action, runtimeFnScheduler) => {
      return runtimeFnScheduler({
        actionName,
        type: 'getPageState',
        params: [struct]
      });
    };
  }
  /**
   * structObject
   * 1. pageState中字段的映射 collectField 「含有运行时状态、表达式」
   * 2. 映射成元数据形式 field
   * 3. 固定映射 aliasField
   */
  return (action, runtimeFnScheduler) => {
    const newStruct = genGetPagetStateStruct(struct, runtimeFnScheduler);
    return runtimeFnScheduler({
      actionName,
      type: 'getPageState',
      params: [newStruct]
    });
  };
};

const genGetPagetStateStruct = (struct: (string | BaseCollectionStruct)[], runtimeFnScheduler) => {
  return struct.reduce(((result, sInfo: (string | BaseCollectionStruct)) => {
    if (typeof sInfo === 'string') {
      result[sInfo] = sInfo;
    } else {
      const { aliasField, field, collectField } = sInfo;
      if (collectField !== undefined) {
        if (aliasField !== undefined) {
          result[aliasField] = collectField;
        }
        // if (field )
      } else {
        console.error('收集结构信息错误无收集字段信息: collectField');
      }
    }
    return result;
  }), {});
};
