import { 
  RemoteTable, InterMeta, InterMetaType, InterRefRelation, RefType,
  TreeInterfaceMeta, RemoteTableColumn, FieldMeta, FieldType,
  FieldDataType,
  RelationType
} from "../../types";
import { getFieldDataType, getTableType } from "./tools";

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
 * 在表元数据中提取关系数据
 * @param meta 后端通用表元数据
 */
export const pickInterMetaOfRemoteMeta = (meta: RemoteTable) => {
  const interRefRelations: InterRefRelation[] = [];
  const { id: interId, code: interCode, columns } = meta;
  const genRefRelationItem = (refInfo, refType: RefType, relationType = RelationType.ONE_TO_ONE) => {
    const { 
      id, fieldId, fieldCode,
      refTableId, refTableCode, 
      refFieldCode, refFieldId,
      refDisplayFieldCode, refDisplayFieldId
    } = refInfo;
    
    return {
      refType, refId: id, relationType,
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
  const { auxTable, references, foreignKeys } = meta;
  /** 引用关系 */
  references?.forEach((refInfo) => {
    /** 不知道树形引用是否需要额外处理 */
    interRefRelations.push(genRefRelationItem(refInfo, RefType.QUOTE));
  });
  /** 外键关系 */
  foreignKeys?.forEach((refInfo) => {
    interRefRelations.push(
      genRefRelationItem(
        refInfo, RefType.FK_Q,
        auxTable?.relationType || RelationType.ONE_TO_ONE
      )
    );
  });
  return interRefRelations;
};

/**
 * 后端通用表元数据转换成接口元数据
 * @param dsRefId 引用id
 * @param meta 后端通用表元数据
 */
export const remoteMeta2InterMeta = (dsRefId: string, meta: RemoteTable): InterMeta => {
  const fields = rMetaCols2FieldsMeta(meta.columns);
  const transfRes: InterMeta = {
    id: meta.id, code: meta.code,
    name: meta.name, refId: dsRefId,
    type: getTableType(meta.type), fields,
    PKField: fields.find(({ fieldDataType }) => fieldDataType === FieldDataType.PK)
  };
  /** 表格无唯一物理主键 */
  if (!transfRes.PKField) {
    throw Error(`表格无唯一物理主键! 表ID:${transfRes.id}、表code:${transfRes.code}、表name:${transfRes.name}`);
  }

  if (transfRes.type === InterMetaType.TREE_TABLE) {
    (transfRes as TreeInterfaceMeta).maxLevel = meta.treeTable?.maxLevel || 15;
  }

  return transfRes;
};