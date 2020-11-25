/* eslint-disable no-param-reassign */
import {
  ComplexType, FoundationType, Schema
} from '@iub-dsl/definition';
import { testSchemas } from "@iub-dsl/demo/business-case/location";
import schemasAnalysis from './analysis/analysis';

/**
 * 数据模型解析器
 * @param schemas 数据模型
 * @steps_1 分析页面数据模型
 * @steps_2 根据分析的关系数据, 实例基础工具类
 * @steps_3 解析
 * @steps_4 实例化状态管理
 */
export const SchemasParser = (originSchemas: Schema) => {
  // originSchemas = Object.assign({}, testSchemas, originSchemas);

  const schemasAnalysisRes = schemasAnalysis(originSchemas);

  // const { levelRelation } = schemasAnalysisRes;

  console.log(schemasAnalysisRes);
  /** 原始逻辑必要的 */
  /** 额外逻辑, 充分的 */

  return schemasAnalysisRes;
};

/**
 * 工具类有什么
 * 1. 搜索某个key相关得路径
 * 2. 获取某个key1-n个上级
 * 3. 获取某个key下级的所有key
 *
 * 方法:
 * 1. 有key, 具体往哪边查找
 * 2. 初始化一个全量
 * 3. 数据变化, 更新多个局部
 */

