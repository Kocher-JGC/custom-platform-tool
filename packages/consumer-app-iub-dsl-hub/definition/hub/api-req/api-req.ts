import { APBDSLReq } from "./api-req-of-APB";

export const enum APIReqType {
  APBDSL = 'APBDSL',
}

export type APIReqRef = string;

export type APIReq = APBDSLReq

export interface APIReqCollection {
  [id: string]: APIReq
}