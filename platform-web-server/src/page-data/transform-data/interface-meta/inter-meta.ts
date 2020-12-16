import { InterMeta, InterRefRelation, GenInterMetaRes, RemoteTable } from "../../types";
import { remoteMeta2InterMeta, pickInterMetaOfRemoteMeta } from "./table-meta";

/**
 * 添加额外数据, 用于自测
 */
const addExtralData = (dsRefIds, dataSource) => {
  const d = [];
  // const d = ['1330690535979098112', '1330691848745918464', '1330691572144152576', '1330691289989128192', '1330690842020683776'];
  dsRefIds.push(...d);
  d.forEach((k) => {
    dataSource[k] = { id:k };
  });
};

/**
 * 生成一个接口元数据关系
 * @param meta 后端表元数据
 */
const genOnceInterRefRelation = (meta: RemoteTable) => {
  return pickInterMetaOfRemoteMeta(meta);
};

/**
 * 后端不同表元数据转换成接口元数据
 * @param dsRefId 引用id
 * @param meta 后端表元数据
 */
const genOnceInterMeta = (dsRefId: string, meta: RemoteTable) => {
  return remoteMeta2InterMeta(dsRefId, meta);
};

/**
 * 生成接口元数据
 * @param dataSource 需要获取接口元数据的数据 
 */
export const genInterMeta = async (dataSource: any, getRemoteTableMeta): Promise<GenInterMetaRes>  => {
  /** */
  const interMetas: InterMeta[] = [];
  const interRefRelations: InterRefRelation[] = [];
  if (typeof dataSource === 'object') {
    const dsRefIds = Object.keys(dataSource);
    /** 额外 测试数据 */
    addExtralData(dsRefIds, dataSource);

    /** 获取所有表的元数据 */
    const rTablesMeta: RemoteTable[] = await getRemoteTableMeta(
      dsRefIds.map(dsRefId => dataSource[dsRefId]?.id).filter(v => v) 
    );

    rTablesMeta.forEach((tMeta) => {
      const interMeta = genOnceInterMeta(tMeta.id, tMeta);
      interMetas.push(interMeta);
      const onceInterRefRelations = genOnceInterRefRelation(tMeta);
      interRefRelations.push(...onceInterRefRelations);
    });
  }
  return {
    interMetas,
    interRefRelations
  };
};
