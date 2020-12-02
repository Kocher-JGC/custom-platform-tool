/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { get as LGet, set as LSet } from 'lodash';
import { CommonObjStruct } from '@iub-dsl/definition';
import { useCacheState } from '../utils';
import { RunTimeCtxToBusiness, DispatchModuleName, DispatchMethodNameOfMetadata } from '../runtime/types';
import { SchemasAnalysisRes, IUBStoreEntity, GetStruct } from './types';
import { InterMetaParseRes } from '../inter-meta-manage/types';
import { isSchema, pickSchemaMark } from '../IUBDSL-mark';

// {
//   getMetaKeyInfo,
//   getFieldKeyInfo,
//   getMetaFieldKey,
//   getMetaFromMark,
//   fieldDataMapToFieldMarkData
// }

const getStructHandle = (struct: GetStruct, handle: (struct: GetStruct) => any) => {
  if (typeof struct === 'string') {
    return handle(struct);
  }
  if (Array.isArray(struct)) {
    return struct.map((newStruct) => getStructHandle(newStruct, handle));
  }
  if (typeof struct === 'object') {
    const structKeys = Object.keys(struct);
    return structKeys.reduce((result, key) => {
      result[getStructHandle(key, handle)] = getStructHandle(struct[key], handle);
      return result;
    }, {});
  }
  return struct;
};

export const createIUB = (schemasParseRes: SchemasAnalysisRes, metadataParseRes: InterMetaParseRes) => {
  const {
    levelRelation, pathMapInfo, baseStruct, pathMapMetaId
  } = schemasParseRes;
  const {
    codeMarkMapIdMark, idMarkMapCodeMark,
    allInterfaceList, allColumnsList
  } = metadataParseRes;
  // 1. code <-> metaMark
  // 2. code <-> schema
  // 3. metaMark <-> schema
  // codeMarkMapIdMark[code]
  // idMarkMapCodeMark[metaMark]
  // pathMapMetaId
  const getSchemaKey = (struct: GetStruct) => {
    if (typeof struct === 'string') {
      if (isSchema(struct)) {
        return pickSchemaMark(struct);
      }
      return '';
    }
    return getStructHandle(struct, getSchemaKey);
  };
  const getMetaCodeKey = (struct: GetStruct) => {
    if (typeof struct === 'string') {
      return '';
    }
    return getStructHandle(struct, getMetaCodeKey);
  };
  const getMetaIdKey = (struct: GetStruct) => {
    if (typeof struct === 'string') {
      return '';
    }
    return getStructHandle(struct, getMetaIdKey);
  };
};

const enum StateKeyType {
  metaMark = 'metaMark',
  metaCode = 'metaCode',
  schemaMark = 'schemaMark'
}

interface PageStateGet {
  getStruct: GetStruct;
  keyType: StateKeyType;
}

/**
 * 数据
 * code --> meta
 * meta --> code
 * schema --> meta
 * meta --> schema ?X 有问题的「页面传值的时候使用了」(缺少系统字段处理的一套方案?)
 * 目前是, 获取某元数据字段被哪个schema使用了, 然后再更新的, 但是应该有一个数据赋值的关系才对「传入值, 接收值」
 * @(varRef)
 * @(schema).id1 = @(varRef).idx
 * @(varRef).idx = @(schema).idd1 // 主附关系, 需要生成多少个?
 * 弹窗的选择
 * 显示值, 实际值 --> 返回对象赋值
 * 1. 输出 选择XXX变量输出, 输入XX的配置
 * 2. 弹窗选择输出 --> records --> 输出当前文本框/动态表格 等等等等 (输出的赋值的配置「在运行时候接受输入」)
 * 3. 回填的时候的额外处理??「有ID传入 + 触发请求 + 额外请求拼接」
 * 系统字段 ?
 * 1、临时上下文储存值
 * 2、表主键、扩展: 单条记录、整表记录、如果是表格、当前格子记录、行/列/定位、 「应该由页面服务生成/页面设计器生成」
 * 3、传入数据 --> 赋值给页面变量 --> 收集数据 --> 发起请求 (合并请求/关系处理)--> (拆分赋值/关系处理)控件赋值
 */

const schemaMMetaMark = {};   // @(schema)
const vals = Object.values(schemaMMetaMark);
const keys = Object.keys(schemaMMetaMark);
const metaCodeMMetaMark = {}; // 
const metaMarkMMetaCode = {}; // @(interMeta)

const transfFn = (struct, options) => {
  const { targetKeyType } = options;
  // @(schema)/@(metaMark) --> @(metaCode)
  if (targetKeyType === StateKeyType.metaCode) {
    const metaMark = isSchema(struct) ? schemaMMetaMark[struct] : struct;
    const code = metaMarkMMetaCode[metaMark];
    return code || struct;
  }
  // @(schema)/@(metaCode) --> @(metaMark)
  if (targetKeyType === StateKeyType.metaMark) {
    if (isSchema(struct)) {
      return schemaMMetaMark[struct];
    }
    return metaCodeMMetaMark[struct] || struct;
  }
  // @(metaMark)/@(metaCode) --> @(schema)
  if (targetKeyType === StateKeyType.schemaMark) {
    // TODO 有问题
    const key = metaCodeMMetaMark[struct] || struct;
    // @(metaMark) --> @(schema)
    const idx = vals.findIndex((v) => v === key);
    return keys[idx];
  }
};

/**
 * 1. 页面加载时, 加载下拉框数据「大类、库存状态、生产商」
 * 2. 当设备大类值改变时, 查询设备小类数据 「回填时候不触发」
 * 3. 条件判断, 下拉框非库存, 不需要填写库存数量
 * 4. 建筑物、楼层、区域树形关系 - 「将A的条件带入B中查询」「树形表+页面变量A改变了、清空了页面变量B」
 * 5. 表达式生成资产编码
 * 6. 弹窗选择
 *  1. 打开页面, 传入条件配置、传入页面变量「如何一一对应」
 *  2. 弹窗传出的值, 默认传出到当前文本框, 但是应该可以像控件赋值那样选择XXX字段值对应XXX页面变量
 * 7. 动态表格的下拉框数据源使用同一个/表达式控制
 * 8. 点击新增根据,接口的依赖关系生成 ID和fID 「默认」
 * 9. 新增完成关闭页面
 * 10. 关闭页面后刷新受影响的接口的数据
 * 11. 附属表根据类型必填
 */
// 新增 资产信息
const A = {
  assessCode: '',
  depart: {
    id: '',
    name: ''
  },
  bigType: {
    code: '',
    name: ''
  },
  smallType: {
    code: '',
    name: ''
  },
  build: {
    id: '',
    name: ''
  },
  floor: {
    pid: '',
    id: '',
    name: ''
  },
  area: {
    pid: '',
    id: '',
    name: ''
  },
  stockType: {
    code: '',
    name: ''
  },
  stockNum: 1,
  // 附属表
  pDevice: {
    id: '',
    name: ''
  },
  prod: {
    code: '',
    name: ''
  },
  startTime: 1,
  endTime: 2,
  remainderDay: 1, // 表达式计算剩余天数
  chanins: [
    {
      chainNum: 1,
      abbreviation: '1',
      chainType: {
        code: '',
        name: ''
      },
      ipAddress: '1,1,1,1',
      port: 80
    }
  ]
};
// 资产列表
/**
 * 1. 页面加载获取下拉框数据
 * 2. 查询, 需要连表, 将实际值转为实际值
 * 3. 点击详情, 传入ID, 拼接3个查询+连表 「但不会查询下拉框数据」
 * 4. 点击修改, 区别详情, 需要查询, 下拉框数据
 */
const AA = {
  assessCode: '',
  bigType: {
    code: '',
    name: ''
  },
  stockType: {
    code: '',
    name: ''
  },
  depart: {
    id: '',
    name: ''
  },
  dataSource: [
    {
      assessCode: '',
      depart: {
        id: '',
        name: ''
      },
      bigType: {
        code: '',
        name: ''
      },
      smallType: {
        code: '',
        name: ''
      },
      build: {
        id: '',
        name: ''
      },
      floor: {
        pid: '',
        id: '',
        name: ''
      },
      area: {
        pid: '',
        id: '',
        name: ''
      },
      stockType: {
        code: '',
        name: ''
      },
      stockNum: 1,
    }
  ]
};

// 出库
/**
 * 点击出库, 传入资产编码, 拼接连表查询, 回填基本信息, 查询下拉框数据
 * 表达式计算 库存数量 - 出库数量 = 剩余数量「隐含的自定义变量」
 * 修改: 修改的页面状态是页面变量
 * 
 */
const B = {
  // 带出的字段
  assessCode: '',
  depart: {
    id: '',
    name: ''
  },
  bigType: {
    code: '',
    name: ''
  },
  smallType: {
    code: '',
    name: ''
  },
  build: {
    id: '',
    name: ''
  },
  floor: {
    pid: '',
    id: '',
    name: ''
  },
  area: {
    pid: '',
    id: '',
    name: ''
  },
  deliveryType: {
    code: '',
    name: ''
  },
  deliveryNum: 1,
  remainderNum: 1,
  deliveryPeople: '张三',
  receiver: '李四',
  deliveryTime: 1,
  deliveryReason: 'dfff'
};

// 出库列表
const BB = {
  assessCode: '',
  deliveryType: {
    code: '',
    name: ''
  },
  /** 不展示的不用额外查询 */
  dataSource: [
    {
      assessCode: '',
      deliveryType: {
        code: '',
        name: ''
      },
      deliveryReason: '',
      deliveryNum: 1,
      remainderNum: 1,
      deliveryPeople: '张三',
      receiver: '李四',
      deliveryTime: 1,
    }
  ]
};