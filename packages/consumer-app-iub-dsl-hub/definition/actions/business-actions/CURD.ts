import { CommonCondition } from '@iub-dsl/definition/public/index';
/**
 * CURD
 * @description 对应原型上的库表操作
*/

export const enum EnumCURD {
  TableInsert = 'TableInsert',
  TableUpdate = 'TableUpdate',
  TableSelect = 'TableSelect',
  TableDelete = 'TableDelete',
  CreateOfInter = 'CreateOfInter',
  UpdateOfInter = 'UpdateOfInter',
  ReadOfInter = 'ReadOfInter',
  DeleteOfInter = 'DeleteOfInter',
}

/** 应该可以支持扩展的, 如引用关系的处理 */
interface InterHandle {
  /** 1) 操作类型 */
  type: string;
  /** 2) 操作的接口 */
  inter: string;
  /** 3) 操作参数[data] */
  params: any;
}
const C = {
  "businesscode": "FC987",
  "steps": [
    
    {
      "function": {
        "code": "RESULT_RESOLVER",
        "params":{
          "resolver":"$ID()"
        }
      }
    },
    {
      "function": {
        "code": "TABLE_INSERT",
        "params": {
          "table": "user",
          "set": [
            {
              "id": "$ID()",
              "fid": "$.steps[0]",
              "name": "张三",
            }
          ]
        }
      }
    },
    {
      "function": {
        "code": "TABLE_INSERT",
        "params": {
          "table": "user",
          "set": [
            {
              "id": "$ID()",
              "fid": "$.steps[0]",
              "name": "张三"
            },
            {
              "id": "$ID()",
              "fid": "$.steps[0]",
              "name": "张三"
            }
          ]
        }
      }
    },
  ]
};

/** APB的组合功能? */
// 1. 引用功能组合 「连表查询」
// 2. 引用关联删除
// 3. 有引用关系的新增

// C -> dataCollect
// U -> dataCollect + condition
// D -> condition
// R -> page\total\fields\sort\group --> 引用关系

/** 
 * 引用关系的抽象
 * A.id ref B.fid
 * A.id ref B.pid
 */

/**
 * 一对一、一对多、多对一、多对多
 */

const ARef = [
  '@(metadata).id', '@(user).username',
  '@(metadata).id', ['@(user).username'],
  ['@(metadata).id'], '@(user).username',
];

const A = {
  'id': 1,
  '@(metadata).d': 1 // 结果 
};

function BC() {
  const ref = { refFrom: '', refTo: [''] };
  const needHandleVal = { ref: 1 };
  const res = {
    [ref.refTo[0]]: 1
  };
  
  const h1 = ({ refFrom, refTo }, origin) => ({ [refTo]: origin[refFrom] });
}

/** 被引用的关系 */
const D = [
  { // 新增一个
    inter: 'group',
    collect: {
      id: "$ID",
      name: '分组1',
      departs: '@(ref).depart.id',
    }
  },
  { // 新增一个
    inter: 'depart',
    collect: [
      {
        id: "$ID",
        name: '部门',
      }
    ]
  },
  { // 新增多个
    inter: 'class',
    collect: [
      {
        id: "$ID",
        name: '科目一',
      }
    ]
  },
  {
    inter: 'user',
    collect: {
      id: "$ID",
      name: '张',
      depId: '@(ref).depart.id',
      class: '@(ref).class.id', // 科目
    }
  },
];

/**
 * 被引用: cited
 * 引用: quote
 * 作用: 
 * 1. 新增时候, 额外拼装
 * 2. 修改时候, 额外赋值
 * 3. 查询时候, 额外查询或者拼接
 * 4. 返回时候数据处理
 * 5. 拼接时候数据处理
 * 
 */

function BB(d: any[]) {
  const refRelation1 = {
    user: {
      field: {
        type: 'quote',
        inter: 'depart',
        field: 'id'
      },
      field2: {
        type: 'cited',
        // cited: 
      }
    }
  };
  const refRelation = [
    {
      inter: 'user',
      quoteDesc: [
        // 知道引用了别人什么
        {
          field: 'depId',
          refInter: 'depart',
          refField: 'id'
        },
        {
          field: 'class',
          refInter: 'class',
          refField: 'id'
        },
      ] 
    },
    {
      inter: 'depart',
      interField: 'id',
      citedDesc: [
        {
          inter: 'user',
          interField: 'depId'
        }
      ]
    },
    {
      inter: 'class',
      interField: 'id',
      citedDesc: [
        {
          inter: 'user',
          interField: 'class'
        }
      ]
    }
  ];

}

/** 查询记录 */
function RR() {
  /**
   * 查询引用别人的
   * 查询被引用的, 仅能通过数据源元数据引用的关系, 添加额外查询
   * 统一转成被引用关系
  */
  /** id: 1 */
  
}



type fieldMapping = string

interface BaseTableInfo {
  table: string;
}

export interface TableInsert extends BaseTableInfo {
  type: EnumCURD.TableInsert;
  fieldMapping: fieldMapping;
}

export interface TableUpdate extends BaseTableInfo, CommonCondition {
  type: EnumCURD.TableUpdate;
  fieldMapping: fieldMapping;
}

export interface TableSelect extends BaseTableInfo, CommonCondition {
  type: EnumCURD.TableSelect;
}

export interface TableDelete extends BaseTableInfo, CommonCondition {
  type: EnumCURD.TableDelete;
}

export type NormalCURD = TableInsert | TableUpdate | TableSelect | TableDelete
