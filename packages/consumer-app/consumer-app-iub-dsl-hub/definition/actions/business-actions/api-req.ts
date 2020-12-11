import { BasicActionConf } from "../action";
import { APIReqRef } from "../../hub";
export type APIReqActionType = 'APIReq';

export interface APIReqAction extends BasicActionConf {
  actionType: APIReqActionType;
  actionOptions: {
    apiReqRef: APIReqRef
  };
}