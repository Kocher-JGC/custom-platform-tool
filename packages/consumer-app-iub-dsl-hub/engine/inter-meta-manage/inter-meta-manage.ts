import { interMetaMark } from './../IUBDSL-mark';
import { pickInterMetaMark } from '../IUBDSL-mark';
import { interMetaParser } from './parser';
import { InterMetaCollection } from "@iub-dsl/definition";
import { InterMetaParseRes, InterMetaEntity, GetInterFieldMark } from './types';
import { DEFAULT_CODE_MARK, TABLE_PATH_SPLIT_MARK } from './const';


const interMetaCtor = (pRes: InterMetaParseRes): InterMetaEntity => {
  const { 
    codeMarkMapIdMark, idMarkMapCodeMark, 
    allFieldList, allInterList, refRelation 
  } = pRes;
  console.log(pRes);
  
  // const allCodeMark = Object.keys(codeMarkMapIdMark);
  // const allIdMark = Object.keys(idMarkMapCodeMark);
  /**
   * id转Code
   * @param mark 标识
   */
  const id2Code = (mark: string) => {
    mark = pickInterMetaMark(mark);
    mark = idMarkMapCodeMark[mark] || mark;
    return mark;
  };
  /**
   * code转id
   * @param mark 标识
   */
  const code2Id = (mark: string) => {
    mark = pickInterMetaMark(mark);
    mark = codeMarkMapIdMark[mark] || mark;
    return mark;
  };
  /**
   * 获取某个接口所有mark
   * @param opts 获取选择
   */
  const getInterFieldMark = (opts: GetInterFieldMark) => {
    /** 定义返回数据 */
    const fieldsMarks: string[] = [];

    /** 获取必要数据 */
    const { inter, target, isPath } = opts;
    const interMeta = getInterMeta(inter);
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
  const getInterMeta = (mark: string) => {
    mark = code2Id(mark);
    console.log(mark);
    
    return allInterList[mark];
  };
  /**
   * 添加新的接口元数据
   * @param meta 接口元数据
   */
  const addInter = (meta: any) => {};

  return {
    id2Code,
    code2Id,
    getInterFieldMark,
    getInterMeta,
    addInter
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