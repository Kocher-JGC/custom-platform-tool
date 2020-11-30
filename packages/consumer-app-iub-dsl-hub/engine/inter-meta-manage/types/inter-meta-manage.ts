// import { 
//   InterMeta, FieldMeta, 
//   BaseInterfaceMeta, TreeInterfaceMeta, 
//   InterMetaType, FieldType, FieldDataType,
//   RefType, InterRefRelation
// } from '@iub-dsl/definition';

import { InterRefRelation, FieldMeta, InterMeta } from "@iub-dsl/definition";

/**
 * 接口元数据解析的结果
 */
export interface InterMetaParseRes {
  /** 所有接口的列表 */
  allInterList: { [interId: string]: InterMeta; };
  /** 所有字段信息 */
  allFieldList: { [fieldIdMark: string]: FieldMeta; };
  /** code标示转换成id标示 */
  codeMarkMapIdMark: { [code: string]: string };
  idMarkMapCodeMark: { [id: string]: string };
  refRelation: {
    [refId: string]: InterRefRelation;
  };
}

/**
 * 接口元数据管理暴露的接口
 */
export interface InterMetaEntity {
  /** id和code的相互转换 */
  id2Code: (mark: string) => string;
  code2Id: (mark: string) => string;
  /** 获取某个接口所有mark */
  getInterFieldMark: (opts: GetInterFieldMark) => any;
  /** 
   * 获取表/接口的信息 
   * mark{
   *  user/username
   *  @(interMeta).user/@(interMeta).user.username} 
   **/
  getInterMeta: (mark: string) => InterMeta;
  /** 添加新的接口元数据 */
  addInter: (...args: any[]) => any;
  /**
   * 标示转换 「user/@(interMeta)」互转
   * 比较复杂
   */
  // markTansform: (o: {
  // fieldsData: any;
  // target: 'code' | 'id';
  // interInfo: any; 
  // }) => any;

  /** 反过来是不合理的 */
  // schemaMark2FieldIdMark: (mark: string) => string;
  /**
   * 反过来应该是 有一个schema范围限定的
   * 1. schema原本的更新
   * 2. 根据interFieldMark更新（有接口范围）
   */
  // changeState: any;
  // getState: any;
  /** 获取某个state下的所有接口元数据信息「页面传参」 */
  // getStateFieldInfo: () => any;
}

export interface GetInterFieldMark {
  inter: string;
  /** 是否拼接路径信息 */
  isPath?: boolean;
  target: 'code' | 'id';
}

