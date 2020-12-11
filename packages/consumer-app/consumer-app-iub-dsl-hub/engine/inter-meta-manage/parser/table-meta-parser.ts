import { InterMeta } from "@iub-dsl/definition";
import { InterMetaParseRes } from "../types";
import { TABLE_PATH_SPLIT_MARK } from "../const";

/**
 * 表格元数据的解析
 * @param meta 接口元数据「表格」
 * @param res 解析结果
 */
export const tableMetaParser = (meta: InterMeta, res: InterMetaParseRes) => {
  const { allFieldList, allInterList, codeMarkMapIdMark, idMarkMapCodeMark } = res;

  const baseIdMark = meta.id;
  const baseCodeMark = meta.code;

  /** 
   * 存储额外值
   */
  codeMarkMapIdMark[baseCodeMark] = baseIdMark;
  idMarkMapCodeMark[baseIdMark] = baseCodeMark;
  allInterList[baseIdMark] = meta;

  meta.fields.forEach((fieldMeta) => {
    const { fieldCode, fieldId } = fieldMeta;
    const fieldIdMark = baseIdMark + TABLE_PATH_SPLIT_MARK + fieldId;
    const fieldCodeMark = baseCodeMark + TABLE_PATH_SPLIT_MARK + fieldCode;

    /** 
     * 存储额外值
     */
    allFieldList[fieldIdMark] = fieldMeta;
    codeMarkMapIdMark[fieldCodeMark] = fieldIdMark;
    idMarkMapCodeMark[fieldIdMark] = fieldCodeMark;
  });

};