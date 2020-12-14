import { GenInterMetaRes } from "./interface";

export interface ProcessCtx { 
  token: string; 
  lessee: string; 
  app: string
}

export interface TransfromCtx {
  extralDsl: { 
    tempAction: any[]; 
    tempFlow: any[];
    tempBusinessCode: any[];
    tempSchema: any[];
    tempWeight: any[];
    tempOpenPageUrl: string;
    tempRef2Val: any[];
    tempAPIReq: any[];
    pageFieldsToUse: { tableId: string, fieldId: string, schemaRef: string; }[];
    pageLifecycle: any;
    isSearch: boolean
  }
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