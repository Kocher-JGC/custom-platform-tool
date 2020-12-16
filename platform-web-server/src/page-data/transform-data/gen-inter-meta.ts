import { 
  RemoteTable, InterMeta, InterMetaType,
  TreeInterfaceMeta, RemoteTableColumn, FieldDataType,
  Species, FieldMeta, FieldType, InterRefRelation,
  RefType,
  GenInterMetaRes,
  RelationType
} from "../types";

/** tool */

/**
 * 获取表类型枚举值
 * @param type 表类型
 */
const getTableType = (type: string): InterMetaType  => {
  return {
    TREE: InterMetaType.TREE_TABLE, // (普通表) 
    TABLE: InterMetaType.NORMAL_TABLE, // (树形表) 
    AUX_TABLE: InterMetaType.AUX_TABLE, // (附属表)
    DICT: InterMetaType.DICT_TABLE
  }[type];
};

/**
 * 获取字段数据类型枚举值
 * @param info 表列信息
 */
const getFieldDataType = (info: RemoteTableColumn): FieldDataType => {
  if (info.dataType === FieldDataType.PK) return FieldDataType.PK;
  if (info.dataType === FieldDataType.FK) return FieldDataType.FK;

  if (info.species === Species.SYS_TMPL) {
    return FieldDataType.SYS;
  }
  return info.dataType as FieldDataType || FieldDataType.SYS;
};

/** tool */

/**
 * 远端cols转换成字段元数据
 * @param columns 字段列表
 */
const rMetaCols2FieldsMeta = (columns: RemoteTableColumn[]): FieldMeta[] => {
  
  return columns
    // .filter()
    // 过滤系统字段
    .map(info => {
      return {
        fieldId: info.id,
        fieldCode: info.code,
        fieldSize: info.fieldSize,
        fieldType: info.fieldType as FieldType,
        fieldDataType: getFieldDataType(info),
        name: info.name,
      };
    }) || [];
  // .reduce((res, val) => ({ ...res, [val.fieldId]: val }), {});
};

/**
 * 后端通用表元数据转换成接口元数据
 * @param dsRefId 引用id
 * @param meta 后端通用表元数据
 */
const rMeta2InterMeta = (dsRefId: string, meta: RemoteTable): InterMeta => {
  const transfRes: InterMeta = {
    type: getTableType(meta.type),
    id: meta.id, code: meta.code,
    name: meta.name, refId: dsRefId,
    fields: rMetaCols2FieldsMeta(meta.columns),
    PKField: rMetaCols2FieldsMeta(meta.columns)[0]
  };
  if (transfRes.type === InterMetaType.TREE_TABLE) {
    (transfRes as TreeInterfaceMeta).maxLevel = meta.treeTable?.maxLevel || 15;
  }

  return transfRes;
};

/**
 * 后端不同表元数据转换成接口元数据
 * @param dsRefId 引用id
 * @param meta 后端表元数据
 */
const genOnceInterMeta = (dsRefId: string, meta: RemoteTable) => {
  return rMeta2InterMeta(dsRefId, meta);
};

const genOnceInterRefRelation = (meta: RemoteTable) => {
  const interRefRelations: InterRefRelation[] = [];
  const { id: interId, code: interCode, columns } = meta;
  const genRefRelationItem = (refInfo, refType: RefType) => {
    const { 
      id, fieldId, fieldCode,
      refTableId, refTableCode, 
      refFieldCode, refFieldId,
      refDisplayFieldCode, refDisplayFieldId
    } = refInfo;
    
    return {
      refType, refId: id, relationType: RelationType.ONE_TO_ONE,
      interId, interCode, fieldId, fieldCode,
      refInterId: refTableId, refInterCode: refTableCode,
      refFieldCode, refFieldId,
      refShowFieldCode: refDisplayFieldCode, refShowFieldId: refDisplayFieldId
    };
  };
  /** 字典关系 */
  columns
    .filter(({ dataType }) => dataType === FieldDataType.DICT)
    .forEach(({ dictionaryForeign }) => {
      interRefRelations.push(genRefRelationItem(dictionaryForeign, RefType.DICT_Q));
    });
  meta.references.forEach((refInfo) => {
    /** 不知道树形引用是否需要额外处理 */
    interRefRelations.push(genRefRelationItem(refInfo, RefType.QUOTE));
  });
  meta.foreignKeys.forEach((refInfo) => {
    interRefRelations.push(genRefRelationItem(refInfo, RefType.FK_Q));
  });
  return interRefRelations;
};


const addExtralData = (dsRefIds, dataSource) => {
  const d = [];
  // const d = ['1330690535979098112', '1330691848745918464', '1330691572144152576', '1330691289989128192', '1330690842020683776'];
  dsRefIds.push(...d);
  d.forEach((k) => {
    dataSource[k] = { id:k };
  });
};


/**
 * 生成接口元数据
 * @param dataSource 需要获取接口元数据的数据 
 */
export const genInterMeta = async (dataSource: any, { getRemoteTableMeta }): Promise<GenInterMetaRes>  => {
  /** */
  const interMetas: InterMeta[] = [];
  const interRefRelations: InterRefRelation[] = [];
  if (typeof dataSource === 'object') {
    const dsRefIds = Object.keys(dataSource);
    /** 额外 测试数据 */
    addExtralData(dsRefIds, dataSource);

    /** 获取所有表的元数据 */
    const rTablesMeta: any[] = await getRemoteTableMeta(
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
