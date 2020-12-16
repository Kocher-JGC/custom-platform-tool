import { groupBy } from "lodash";
import { TransfromCtx, RefType } from "@src/page-data/types";

const genRead = ({ genReadDef, genOnceRead }, { readFields }) => {
  const { table, field } = readFields;
  const joins: any[] = [];
  // const readField: any[] = [];
  const read = genOnceRead();
  const readRef = '';
  genReadDef({ readRef, joins });
  // const readDef = {
  //   readRef: mainReadId,
  //   joins
  // };
  // const readList: any = {
  //   [mainReadId]: {
  //     table: tableInfo.code,
  //     fields: readField, alias: tableId,
  //   }
  // };
};

const genWrap = () => {
  const genJoin = (
    { genReadDef, genJoinsCond },
    { readDef, joinsType, joinsCond }
  ) => ({
    readDef: genReadDef(readDef),
    joinsType,
    joinsCond: genJoinsCond(joinsCond)
  });
  const genReadDef = ({ genJoins }, { readRef, joins }) => ({
    readRef,
    joins: genJoins(joins)
  });
  const genOnceRead = ({ genCond }, { table, fields, condition }) => ({
    table, fields, condition: genCond(condition)
  });
  // genRead({ genReadDef,  genOnceRead });
};

const gen2 = ({ genReadDef, genOnceRead }, { readFields }) => {
  /**
   * 1. 生成各个read信息
   * 2. 生成连表信息
   * 3. 拼接
   */
  const { tableId, fieldId } = readFields;
  const readds = [
    {
      tableId: '',
      fields: []
    }
  ];
  const readList: any[] = [];
  /** 生成了所有单条的读取 */
  readList.push(genOnceRead(readds[0]));



};

const wrap: any = () => {};


export const gen = (transfromCtx: TransfromCtx, widgetProps) => {
  const { interMetaT, logger } = transfromCtx;
  const { getIntersPK, findRefRelation, getFields } = interMetaT;
  const { id, widgetRef, propState } = widgetProps;
  const { ds: dsIds, columns } = propState;
  const intersPKMeta = getIntersPK(dsIds);
  
  const { genOnceRead } = wrap;

  if (intersPKMeta.length === dsIds?.length) {
    /** 单独添加读取pk的信息 */
    intersPKMeta.forEach((PKFieldMeta, idx) => {
      const { fieldId, fieldCode } = PKFieldMeta;
      columns.push({
        dsID: dsIds[idx], fieldID: fieldId, show: false,
        field: fieldCode, id: fieldId, desc: 'PK'
      });
    });
    /**
     * 表格的schema/readField「根据column+引用关系生成」
     */
    /** 所有可以使用的引用关系 */
    const refRels = findRefRelation({ inters: dsIds });
    /** 将关系分类 (直接关系、间接关系)(或者说: 子关系、父关系) */
    const [subRefRels, pRefRels] = refRels.reduce((res, refRel) => {
      res[refRel.refType === RefType.FK_Q ? 1 : 0].push(refRel);
      return res;
    }, [[], []]);
    /** 将需要读取的字段按照inter分组, {TODO: 遗留问题自定义列如何分组?} */
    const groupByInter = groupBy(columns, 'dsID');
    console.log(groupByInter);
    /** 每一组的处理 */
    Object.values(groupByInter).forEach((cols) => {
      cols.forEach((colInfo) => {
        const { dsID, fieldID } = colInfo;
        /** 子关系处理, 建立read、schema */
        const subRefRel = subRefRels.find(item => item.fieldId === fieldID);
        // if (subRefRel) {
        // 生成schema、单个字段的read、查询回填的映射
        // } else {

        // }
      });

    });
    
    /**
     * 1. 表的schema、readFields
     * 2. 选择器的 事件/动作
     * 3. tableReq 事件/动作
     */
  } else {
    // err 
  }

};