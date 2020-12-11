import { BasicActionConf } from "../action";
export type LinkageType = 'Linkage';

export interface Linkage extends BasicActionConf {
  actionType: LinkageType;
  actionOptions: {

  };
}

// interface
// fieldCode , condition
// changeMapping