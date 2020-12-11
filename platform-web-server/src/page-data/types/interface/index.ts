import { InterMeta } from './interface-meta';
import { InterRefRelation } from './interace-relation';

export * from './interface-meta';
export * from './interace-relation';

export interface GenInterMetaRes {
  interMetas: InterMeta[];
  interRefRelations: InterRefRelation[];
}