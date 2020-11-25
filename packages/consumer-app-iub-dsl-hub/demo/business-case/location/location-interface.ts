import { 
  InterfaceMetaCollection, InterfaceType, 
  FieldType, FieldDataType, RefType 
} from '@iub-dsl/definition';
export const locationInterface: InterfaceMetaCollection = {
  meta: {
    1330690108524994560: {
      type: InterfaceType.TREE_TABLE,
      /** 该条记录的 id */
      id: '1330690108524994560',
      /** 名字 */
      name: '位置管理',
      code: 'location',
      maxLevel: 15,
      fields: [
        {
          id: '1330690108566937603',
          name: '层级',
          fieldDataType: FieldDataType.NORMAL,
          fieldSize: 3,
          fieldType: FieldType.INT,
          fieldCode: 'level',
          // fieldProperty: {} //字段校验
        },
        {
          id: '1330690108566937605',
          name: '上级位置',
          fieldCode: 'pid',
          fieldSize: 20,
          fieldType: FieldType.INT,
          fieldDataType: FieldDataType.QUOTE,
        },
        {
          id: '1330692953483649025',
          name: '位置类型',
          fieldCode: 'type',
          fieldSize: 32,
          fieldType: FieldType.STRING,
          fieldDataType: FieldDataType.DICT,
        },
        {
          id: '1330690108566937613',
          name: '路径',
          fieldCode: 'path',
          fieldSize: 512,
          fieldType: FieldType.STRING,
          fieldDataType: FieldDataType.NORMAL,
        },
        {
          id: '1330690108566937614',
          name: '位置名称',
          fieldCode: 'name',
          fieldSize: 32,
          fieldType: FieldType.STRING,
          fieldDataType: FieldDataType.NORMAL,
        },
        {
          id: '1330690108566937616',
          name: '主键',
          fieldCode: 'id',
          fieldSize: 20,
          fieldType: FieldType.INT,
          fieldDataType: FieldDataType.PK,
        },
      ],
    },
    1330690535979098112: {
      type: InterfaceType.DICT_TABLE,
      id: '1330690535979098112',
      code: 'dict_weizhileixing',
      name: '位置类型',
      fields: [
        {
          id: 'code',
          fieldCode: 'code',
          fieldSize: 32,
          fieldType: FieldType.STRING,
          fieldDataType: FieldDataType.NORMAL,
        },
        {
          id: 'name',
          fieldCode: 'name',
          fieldSize: 32,
          fieldType: FieldType.STRING,
          fieldDataType: FieldDataType.NORMAL,
        }
      ],
    }
  },
  /** A 引用 B, 发起额外请求 */
  refRelation: {
    '1330690108524994560/1330690108566937605': {
      refType: RefType.QUOTE,
      refId: '1330690108524994560/1330690108566937605',
      interId: '1330690108524994560',
      interCode: 'location',
      fieldId: '1330690108566937605',
      fieldCode: 'pid',
      refInterId: '1330690108524994560',
      refInterCode: 'location',
      refFieldId: '1330690108566937616',
      refFieldCode: 'id',
    },
    '1330690108524994560/1330692953483649025': {
      refType: RefType.DICT,
      refId: '1330690108524994560/1330692953483649025',
      interId: '1330690108524994560',
      interCode: 'location',
      fieldId: '1330692953483649025',
      fieldCode: 'type',
      refInterId: '1330690535979098112',
      refInterCode: 'dict_weizhileixing',
      refFieldId: 'code',
      refFieldCode: 'code',
    },
  }
};