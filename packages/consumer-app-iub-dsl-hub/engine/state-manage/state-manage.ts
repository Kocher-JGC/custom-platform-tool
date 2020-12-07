/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { get as LGet } from 'lodash';
import { CommonObjStruct, ChangeMapping } from '@iub-dsl/definition';
import { useCacheState } from '../utils';
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfMetadata } from '../runtime/types';
import { SchemasAnalysisRes, IUBStoreEntity, GetStruct } from './types';
import { setOfSchemaPath } from './utils';
import { isSchema, pickSchemaMark } from '../IUBDSL-mark';

const reg = /(?<=[\\/\\[]?)([^\\/\\[\]]+)(?=[\\/\]\\[]?)/g;


// TODO
const getFullInitStruct = ({ baseStruct, pathMapInfo }: {
  baseStruct: CommonObjStruct,
  pathMapInfo: any
}) => {
  return Object.keys(baseStruct).reduce((result, key) => {
    if (typeof baseStruct[key] === 'string') {
      // result[key] = key;
      result[key] = baseStruct[key];
    } else if (
      pathMapInfo[key]?.structType === 'structArray'
      // Array.isArray(baseStruct[key])
    ) {
      result[key] = [];
    } else {
      result[key] = getFullInitStruct({ baseStruct: baseStruct[key], pathMapInfo });
    }
    return result;
  }, {});
};

const collectFieldMapping = (schemaInfo: any) => {
  const { collectionType, fieldMapping, struct } = schemaInfo;
  const res: string[] = [];
  if (typeof collectionType === 'string' && Array.isArray(struct)) {
    struct.forEach((item) => res.push(...collectFieldMapping(item)));
  }
  if (typeof fieldMapping === 'string') {
    res.push(fieldMapping);
  }

  return res;
};

/** TODO: 跨页面问题 */
export const createIUBStore = (analysisData: SchemasAnalysisRes) => {
  const { levelRelation, pathMapInfo, baseStruct } = analysisData;
  const schemaMarkArr = Object.keys(pathMapInfo);
  const fullStruct = getFullInitStruct({ baseStruct, pathMapInfo });

  const getSchemaInfo = (schemaPath: string) => {
    if (isSchema(schemaPath)) {
      schemaPath = pickSchemaMark(schemaPath);
    }
    return pathMapInfo[schemaPath];
  };

  return (): IUBStoreEntity => {
    const [IUBPageStore, setIUBPageStore] = useCacheState(fullStruct);

    // console.log(IUBPageStore);
    
    /** 放到里面会锁定, 放到外面会一直被重新定义 */
    const getPageState = (ctx: RunTimeCtxToBusiness, strOrStruct: GetStruct = '') => {
      if (strOrStruct === '') {
        return IUBPageStore;
      }
      if (typeof strOrStruct === 'string') {
        if (isSchema(strOrStruct)) {
          // _.at(object, [paths])
          strOrStruct = pickSchemaMark(strOrStruct);
          return LGet(IUBPageStore, strOrStruct.match(reg), '');
        }
        // console.warn('stateManage: 非schemas描述');
        // TODO
        return strOrStruct;
      }
      if (Array.isArray(strOrStruct)) {
        return strOrStruct.map((newStruct) => getPageState(ctx, newStruct));
      }
      if (typeof strOrStruct === 'object') {
        const structKeys = Object.keys(strOrStruct);
        return structKeys.reduce((result, key) => {
          result[key] = getPageState(ctx, strOrStruct[key]);
          return result;
        }, {});
      }
    };
    const getWatchDeps = getPageState;

    const getPageState2 = (ctx: RunTimeCtxToBusiness, struct: string[]) => {
      const state = struct.reduce((res, key) => ({ ...res, [key]: LGet(IUBPageStore, key, '') }), {});
      return state;
    };
    /** 复杂数据的更新 */
    const mappingUpdateState = (ctx: RunTimeCtxToBusiness, changeMaps: any) => {
      // const newState = IUBPageStore;
      // changeMaps.forEach(({ from, target }) => {
      //   setOfSchemaPath(newState, target, from);
      // });
      setIUBPageStore(changeMaps);
    };
    

    const handleFn = useMemo(() => {
      /** 单个数据的更新 */
      const targetUpdateState = (ctx: RunTimeCtxToBusiness, target, value) => {
        target = pickSchemaMark(target);
        setIUBPageStore({
          [target]: value
        });
      };

      /** 元数据映射进行更新页面状态 @(metadata).dId: val */
      const updatePageStateFromMetaMapping = (ctx: RunTimeCtxToBusiness, fieldMappingValue: any) => {
        const fieldMappingArr = Object.keys(fieldMappingValue);
        const updateValue = {};
        schemaMarkArr.forEach((mark) => {
          const schemaInfo = pathMapInfo[mark];
          const { fieldMapping } = schemaInfo;
          const idx = fieldMappingArr.indexOf(fieldMapping);
          if (idx > -1) {
            updateValue[mark] = fieldMappingValue[fieldMappingArr[idx]];
          }
        });
        setIUBPageStore(updateValue);
        return updateValue;
      };

      /** 根据表元数据映射进行更新页面状态 name: val */
      const updatePageStateFromTableRecord = (ctx: RunTimeCtxToBusiness, tableRecord, metadata) => {
        const { dispatchOfIUBEngine } = ctx;
        const fieldMappingValue = dispatchOfIUBEngine({
          dispatch: {
            module: DispatchModuleName.metadata,
            method: DispatchMethodNameOfMetadata.fieldDataMapToFieldMarkData,
            params: [tableRecord, metadata]
          }
        });
        return updatePageStateFromMetaMapping(ctx, fieldMappingValue);
      };

      /** 将schema的唯一元数据信息 */
      const getSchemaMetadata = ({ dispatchOfIUBEngine }: RunTimeCtxToBusiness, schemaPath: string) => {
        const schemaInfo = getSchemaInfo(schemaPath);
        const fieldMapping = collectFieldMapping(schemaInfo);
        return dispatchOfIUBEngine({
          dispatch: {
            module: DispatchModuleName.metadata,
            method: DispatchMethodNameOfMetadata.getMetaFromMark,
            params: [fieldMapping]
          }
        });
      };

      return {
        targetUpdateState,
        getSchemaMetadata,
        updatePageStateFromTableRecord,
        updatePageStateFromMetaMapping
      };
    }, []);

    return {
      getPageState,
      getPageState2,
      getWatchDeps,
      mappingUpdateState,
      ...handleFn
    };
  };
};
