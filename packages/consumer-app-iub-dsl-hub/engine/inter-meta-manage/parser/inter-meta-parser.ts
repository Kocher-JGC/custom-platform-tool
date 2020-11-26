import { 
  InterMetaCollection, InterMeta,
} from '@iub-dsl/definition';
import { InterMetaParseRes } from '../types';
import { tableMetaParser } from './table-meta-parser';

/**
 * 解析调度器
 * @param meta 单个接口元数据
 * @param res 解析结果
 */
const interMetaParserScheduler = (meta: InterMeta, res: InterMetaParseRes) => {
  tableMetaParser(meta, res);
  // switch (meta.type) {
  //   case InterType.NORMAL_TABLE:
  //   case InterType.TREE_TABLE:
  //   case InterType.DICT_TABLE:
  //   case InterType.AUX_TABLE:
  //   default:
  //     break;
  // }
};

/**
 * 解析接口元数据
 * @param interMetaC 接口元数据集合
 */
export const interMetaParser = (interMetaC: InterMetaCollection) => {
  const { metaList, refRelation } = interMetaC;

  const interMetaParserRes = initInterMetaParseRes();
  interMetaParserRes.refRelation = refRelation;

  const interMetaIds = Object.keys(metaList);

  interMetaIds.forEach((id) => {
    const interMeta = metaList[id];
    interMetaParserScheduler(interMeta, interMetaParserRes);
  });

  return interMetaParserRes;
};


/**
 * 初始化解析结果数据结构
 */
const initInterMetaParseRes = (): InterMetaParseRes => {
  return {
    allFieldList: {},
    allInterList: {},
    codeMarkMapIdMark: {},
    idMarkMapCodeMark: {},
    refRelation: {}
  };
};