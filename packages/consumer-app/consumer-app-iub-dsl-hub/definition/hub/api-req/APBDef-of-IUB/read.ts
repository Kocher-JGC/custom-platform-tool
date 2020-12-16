/**
 * 读取的定义比较复杂, 单独文件
 */
import { refIdOfCondition } from '@iub-dsl/definition';
import { FuncCodeOfAPB, BaseAPBDef } from "../api-req-of-APB";

/**
 * 读取的公共部分信息
 */
export interface ReadBaseInfo extends ReadPageInfo {
  table: string;
  /** 字段映射信息 */
  fields?: {
    field: string | CountFn;
    alias: string;
  }[];
  readField?: {
    alias: string;
    field: string;
    fieldId: string;
    tableId: string;
  }[];
  condition?: refIdOfCondition;
  sort?: { [str: string]: 'desc' | 'asc'; };
  group?: {
    havingCondition: refIdOfCondition;
    groupBy: string[];
  },
}


/**
 * 读取功能的定义
 */
export interface ReadDef extends ReadRefObjDef, BaseAPBDef {
  funcCode: FuncCodeOfAPB.R;
}

/**
 * 读取参照物的定义
 */
export interface ReadRefObjDef {
  readList: {
    [str: string]: ReadBaseInfo
  },
  readDef: ReadOnceRefObjDef
}

/**
 * 读取一个对象「参照物」的定义
 * 参照物「对象」:  
 * 1. 「表」mysql关系型数据库连表查询
 * 2. 「集合」Mongo非关系型数据库{关联查询「$lookup」、过滤「pipeline」}
 */
export interface ReadOnceRefObjDef {
  /** 读取引用  */
  readRef: string; // ReadOnceRefObjDef 理论上可以这样递归
  /** 连接描述 */
  joins?: JoinsDef[]
}


/** 
 * 参照物读取连接的定义
 */
export interface JoinsDef {
  /**
   * 读取的定义「引用/读取一个对象的定义」
   * string: 仅有 readRef // 但结构具有唯一性更好维护
   */
  readDef: ReadOnceRefObjDef;
  /** 连接类型 */
  joinsType: JoinsType;
  /** 连接条件 */
  joinsCond: refIdOfCondition;
}

/**
 * 参照物读取连接的类型
 */
export const enum JoinsType{
  leftJoin = 'leftJoin',
  rightJoin = 'rightJoin',
  innerJoin = 'innerJoin',
  crossJoin = 'crossJoin',
} 

/** 读的分页信息 */
interface ReadPageInfo {
  page?: {
    from: number;
    size: number;
  };
  needTotal?: boolean;
}

/** 统计函数 */
const enum CountFn {
  count = 'count()',
  sum = 'sum()',
  avg = 'avg()',
  max = 'max()',
  min = 'min()',
}

/**
 * 配置生成的数据
 */
// const mockRead: ReadDef = {
//   funcCode: FuncCodeOfAPB.R,
//   readList: {},
//   readDef: {
//     readRef: 'assets', // 资产主表
//     joins: [
//       {
//         readDef: {
//           readRef: 'assets_attrs', // 附属1.设备属性
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'assets_chain_info', // 附属2.通道
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//     ]
//   },
// };

/**
 * 1. 在转换的时候 「readDef/joinsType/readDef」为一个整体
 * 2. 获取资产主表的时候, 发现需要读取的引用字段, 添加连表信息、「根据: 引用关系, 实际值, 显示值 生成 连表信息」
 *  2.1. 获取引用表字段信息的时候, 根据schemas的嵌套信息, 生成嵌套 连表请求 「后续完善」
 * 3. 连表信息是针对 ReadOnceRefObjDef 这个整体生成的
 */

/**
 * POC, 资产管理
 *  (资产 on (部门 on 视频设备类) on 设备 on 设备 on 区域 on 区域 on 区域 on 库存状态) on ( 设备属性 on 父设备 on 生产 ) on ( 通道 on 通道类型 )
 *  默认: (资产 on 设备属性 on 通道)「? 设备大类 = 视频设备类」
 */
// const actualRead: ReadDef = {
//   funcCode: FuncCodeOfAPB.R,
//   readList: {},
//   readDef: {
//     readRef: 'assets', // 资产主表
//     joins: [
//       {
//         /** 字段引用关系又生成一级 */
//         readDef: {
//           readRef: 'department',// 部门
//           joins: [
//             {
//               readDef: {
//                 readRef: 'location_type',
//               },
//               joinsType: JoinsType.leftJoin,
//               joinsCond: '',
//             }
//           ]
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'device', // 设备大类
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'device', // 设备小类
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'location', // 建筑物
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'location', // 楼层
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'location', // 区域
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'stock_status', // 库存状态
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'assets_attrs', // 附属1.设备属性
//           joins: [
//             {
//               readDef: {
//                 readRef: 'device', // 父设备
//               },
//               joinsType: JoinsType.leftJoin,
//               joinsCond: '',
//             },
//             {
//               readDef: {
//                 readRef: 'dict_shengchanchangshang', // 生产厂商字典
//               },
//               joinsType: JoinsType.leftJoin,
//               joinsCond: '',
//             }
//           ]
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//       {
//         readDef: {
//           readRef: 'assets_chain_info', // 附属2.通道
//           joins: [
//             {
//               readDef: {
//                 readRef: 'dict_tongdaoleixing', // 通道类型字典
//               },
//               joinsType: JoinsType.leftJoin,
//               joinsCond: '',
//             }
//           ],
//         },
//         joinsType: JoinsType.leftJoin,
//         joinsCond: '',
//       },
//     ]
//   },
// };

