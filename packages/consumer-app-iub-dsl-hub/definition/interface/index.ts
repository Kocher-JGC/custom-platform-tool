import { InterMeta } from './interface-meta';
import { InterRefRelation } from './interace-relation';

export * from './interface-meta';
export * from './interace-relation';

export interface InterMetaCollection {
  metaList: {
    [srt: string]: InterMeta
  };
  refRelation: {
    [refId: string]: InterRefRelation;
  };
}