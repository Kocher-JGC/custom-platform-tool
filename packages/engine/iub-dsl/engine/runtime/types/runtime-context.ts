import { RunTimeCtxToBusiness } from '.';
import { EffectRelationshipEntity } from '../../relationship';
import { IUBStoreEntity } from '../../state-manage/types';
/**
* TODO: 分类
* 1. 异步/同步
* 2. 静态/动态 「运行时useMemo会改变的」
* TODO: 待修改问题
* 1. 类型、调用上下文规范
*/

export interface GRCtx {
  runTimeCtxToBusiness: React.MutableRefObject<RunTimeCtxToBusiness>,
  IUBStoreEntity: IUBStoreEntity;
  effectRelationship: EffectRelationshipEntity;
}
