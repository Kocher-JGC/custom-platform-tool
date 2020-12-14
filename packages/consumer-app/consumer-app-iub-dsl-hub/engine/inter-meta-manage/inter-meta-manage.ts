import { interMetaMark } from './../IUBDSL-mark';
import { pickInterMetaMark } from '../IUBDSL-mark';
import { interMetaParser } from './parser';
import { InterMetaCollection, RefType, InterRefRelation } from "@iub-dsl/definition";
import { InterMetaParseRes, InterMetaEntity, GetInterFieldMark, FindRefRelationParam } from './types';
import { DEFAULT_CODE_MARK, TABLE_PATH_SPLIT_MARK } from './const';
import { RunTimeCtxToBusiness } from '../runtime/types';


const interMetaCtor = (pRes: InterMetaParseRes): InterMetaEntity => {
  const { 
    codeMarkMapIdMark, idMarkMapCodeMark, 
    allFieldList, allInterList, refRelation 
  } = pRes;
  // const refRelationKeys = Object.keys(refRelation);
  console.log(pRes);
  const refRelationValues = Object.values(refRelation);
  
  /**
   * 查找表/字段所有的引用关系
   * @param str 1.tableCode/tableId2.fields
   */
  const findRefRelation = (IUBCtx: RunTimeCtxToBusiness,{ tables, refType, fields }: FindRefRelationParam) => {
    /** 过滤type的函数 */
    const refTypeFilter = refType ? (type) => type === refType : (type) => true;
    /** 以后再合成把 */
    const validTable = Array.isArray(tables)
      ? ((interIds: string[]) => (rR: InterRefRelation) => interIds.includes(rR.interId))(tables.map(t => code2Id(IUBCtx, t)))
      : () => false;
    const validFields = Array.isArray(fields) 
      ? ((fieldsId: string[]) => (rR: InterRefRelation) => fieldsId.includes(rR.fieldId))(fields) /** TODO: 这里无法确保为fieldsId */
      : () => false;
    const refRelationArr = refRelationValues.filter((rR: InterRefRelation) => (validTable(rR) || validFields(rR)) && refTypeFilter(refType));

    return refRelationArr;
  };

  /**
   * 查找表特定类型的字段 fieldDataType
   */
  // const findFiledsCode = (table: string ,fieldDataType: FieldDataType) => {}
  // console.log(refRelation);
    
  // const allCodeMark = Object.keys(codeMarkMapIdMark);
  // const allIdMark = Object.keys(idMarkMapCodeMark);
  /**
   * id转Code
   * @param mark 标识
   */
  const id2Code = (IUBCtx: RunTimeCtxToBusiness, mark: string) => {
    mark = pickInterMetaMark(mark);
    mark = idMarkMapCodeMark[mark] || mark;
    return mark;
  };
  /**
   * code转id
   * @param mark 标识
   */
  const code2Id = (IUBCtx: RunTimeCtxToBusiness, mark: string) => {
    mark = pickInterMetaMark(mark);
    mark = codeMarkMapIdMark[mark] || mark;
    return mark;
  };
  /**
   * 获取某个接口所有mark
   * @param opts 获取选择
   */
  const getInterFieldMark = (IUBCtx: RunTimeCtxToBusiness, opts: GetInterFieldMark) => {
    /** 定义返回数据 */
    const fieldsMarks: string[] = [];

    /** 获取必要数据 */
    const { inter, target, isPath } = opts;
    const interMeta = getInterMeta(IUBCtx, inter);
    if (!interMeta) return fieldsMarks;

    /**
     * 组装基础数据
     */
    let basePath = '';
    if (isPath) {
      basePath = (target === 'id' ? interMetaMark : '') + (interMeta[target] || '') + TABLE_PATH_SPLIT_MARK;
    }
    const gMark = target === 'code' ? DEFAULT_CODE_MARK : target;

    /**
     * 获取mark
     */
    interMeta?.fields?.forEach((fieldM) => {
      fieldsMarks.push(basePath + fieldM[gMark]);
    });

    return fieldsMarks;
  };
  /** 
   * 获取表/接口的信息 
   * mark{
   *  user/username
   *  @(interMeta).user/@(interMeta).user.username} 
   **/
  const getInterMeta = (IUBCtx: RunTimeCtxToBusiness, mark: string) => {
    mark = code2Id(IUBCtx, mark);
    console.log(mark);
    
    return allInterList[mark];
  };
  /**
   * 添加新的接口元数据
   * @param meta 接口元数据
   */
  const addInter = (IUBCtx: RunTimeCtxToBusiness, meta: any) => {};

  return {
    id2Code,
    code2Id,
    getInterFieldMark,
    getInterMeta,
    addInter,
    findRefRelation
  };
};

/**
 * 接口元数据管理统一入口
 * @param interMetaC 接口元数据集合
 */
export const interMetaManage = (interMetaC: InterMetaCollection) => {
  const interMetaParseRes = interMetaParser(interMetaC);

  return interMetaCtor(interMetaParseRes);
};