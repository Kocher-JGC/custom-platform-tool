import { RemoteTable, SchemaItemDef } from '@src/page-data/types';
import { Logger } from 'winston';
import { GenInterMetaRes, InterMetaTools } from "./interface";

export interface ProcessCtx { 
  token: string; 
  lessee: string; 
  app: string
}

export interface TransfCtx {
  getRemoteTableMeta: (tableIds: string[]) => Promise<RemoteTable>
  logger: Logger
}

export interface TransfromCtx {
  /** tools */
  logger: Logger
  interMetaT: InterMetaTools;
  /** ----tools---- */

  extralDsl: { 
    tempAction: any[]; 
    tempFlow: any[];
    tempBusinessCode: any[];
    tempSchema: any[]; // SchemaItemDef[];
    tempWeight: any[];
    tempOpenPageUrl: string;
    tempRef2Val: any[];
    tempAPIReq: any[];
    pageFieldsToUse: { tableId: string, fieldId: string, schemaRef: string; }[];
    pageLifecycle: any;
    isSearch: boolean
  }
  pkSchemaRef: string[];
  interMeta: GenInterMetaRes;
  schema: any;
  metaSchema: {
    [str: string]: {
      column: {
        fieldCode: string;
        id: string;
        name: string;
      };
      tableInfo: {
        id: string;
        name: string;
      }
    }
  }
}