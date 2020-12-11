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
    isSearch: boolean
  }
  interMeta: GenInterMetaRes;
  schema: any;
}