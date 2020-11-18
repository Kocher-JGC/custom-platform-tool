import { CommonObjStruct, ChangeMapping } from "@iub-dsl/definition";
import { RunTimeCtxToBusiness } from "../../runtime/types";

export type GetStruct = string | {
  [str: string]: any
} | any[]

export type IUBStoreMethod = keyof IUBStoreEntity;

export interface IUBStoreEntity {
  mappingUpdateState: (ctx: RunTimeCtxToBusiness, changeMaps: ChangeMapping[]) => void;
  isPageState: (ctx: RunTimeCtxToBusiness, param: string) => boolean;
  pickPageStateKeyWord: (ctx: RunTimeCtxToBusiness, param: string) => string;
  targetUpdateState: (ctx: RunTimeCtxToBusiness, target: any, value: any) => void;
  getPageState: (ctx: RunTimeCtxToBusiness, strOrStruct?: GetStruct) => any;
  getWatchDeps: (ctx: RunTimeCtxToBusiness, strOrStruct?: GetStruct) => any;
  getSchemaMetadata: (ctx: RunTimeCtxToBusiness, schemaPath: string) => any;
  updatePageStateFromTableRecord: (ctx: RunTimeCtxToBusiness, tableRecord, metadata) => any;
  updatePageStateFromMetaMapping: (ctx: RunTimeCtxToBusiness, fieldMappingValue: any) => any;
}

/** 描述对象从[from]: any 转换成 [to]:any */
interface MapConf {
  from: string;
  to: string;
}
/** 映射的参数 */
interface MapDataParam<T> {
  pathKey: string;
  mapConf: MapConf;
  data: T | T[]
}
