import { InterfaceMeta } from './interface-meta';
import { InterfaceRefRelation } from './interace-relation';

export * from './interface-meta';
export * from './interace-relation';

export interface InterfaceMetaCollection {
  meta: {
    [srt: string]: InterfaceMeta
  };
  refRelation: {
    [refId: string]: InterfaceRefRelation;
  };
}