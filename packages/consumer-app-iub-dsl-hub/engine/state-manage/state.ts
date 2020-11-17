/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import {
  get as LGet, set as LSet
} from 'lodash';
import { CommonObjStruct } from '@iub-dsl/definition';
import { useCacheState } from '../utils';
import { isPageState, pickPageStateKeyWord } from './const';
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfMetadata } from '../runtime/types';
import { SchemasAnalysisRes, IUBStoreEntity, GetStruct } from './types';
import { MetaDateParseRes } from '../metadata-manage/types';

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
      result[key] = getFullInitStruct(baseStruct[key]);
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
// {
//   getMetaKeyInfo,
//   getFieldKeyInfo,
//   getMetaFieldKey,
//   getMetaFromMark,
//   fieldDataMapToFieldMarkData
// }

const getStructHandle = (struct: GetStruct, handle: (struct: GetStruct) => any) => {
  if (typeof struct === 'string') {
    return handle(struct);
  }
  if (Array.isArray(struct)) {
    return struct.map((newStruct) => getStructHandle(newStruct, handle));
  }
  if (typeof struct === 'object') {
    const structKeys = Object.keys(struct);
    return structKeys.reduce((result, key) => {
      result[getStructHandle(key, handle)] = getStructHandle(struct[key], handle);
      return result;
    }, {});
  }
  return struct;
};

export const createIUB = (schemasParseRes: SchemasAnalysisRes, metadataParseRes: MetaDateParseRes) => {
  const {
    levelRelation, pathMapInfo, baseStruct, pathMapMetaId
  } = schemasParseRes;
  const {
    codeMarkMapIdMark, idMarkMapCodeMark,
    allInterfaceList, allColumnsList
  } = metadataParseRes;
  // 1. code <-> metaId
  // 2. code <-> schema
  // 3. metaId <-> schema
  // codeMarkMapIdMark[code]
  // idMarkMapCodeMark[metaId]
  // pathMapMetaId
  const getSchemaKey = (struct: GetStruct) => {
    if (typeof struct === 'string') {
      if (isPageState(struct)) {
        return pickPageStateKeyWord(struct);
      }
      return '';
    }
    return getStructHandle(struct, getSchemaKey);
  };
  const getMetaCodeKey = (struct: GetStruct) => {
    if (typeof struct === 'string') {
      return '';
    }
    return getStructHandle(struct, getMetaCodeKey);
  };
  const getMetaIdKey = (struct: GetStruct) => {
    if (typeof struct === 'string') {
      return '';
    }
    return getStructHandle(struct, getMetaIdKey);
  };
};

enum StateKeyType {
  metaId = 'metaId',
  metaCode = 'metaCode',
  schema = 'schema'
}

interface PageStateGet {
  getStruct: GetStruct;
  keyType: StateKeyType;
}
