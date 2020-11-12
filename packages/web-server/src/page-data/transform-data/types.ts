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
    isSearch: boolean
  }
  tableMetadata: any[]
}