
export const a = {
  "createdUserName": null,
  "modifiedUserName": null,
  "id": "1330688851571777536",
  "name": "资产的设备属性",
  "code": "assets_attrs",
  "type": "AUX_TABLE",
  "moduleId": "1330687074365480960",
  "moduleName": "资产管理",
  "species": "BIS",
  "description": null,
  "gmtCreate": 1606095919896,
  "modifiedBy": "1295915065878388737",
  "gmtModified": 1606102594769,
  "hadAuxTable": null,
  "auxTable": {
    "mainTableCode": "assets",
    "relationType": "ONE_TO_ONE",
    "parentTable": {
      "createdUserName": null,
      "modifiedUserName": null,
      "id": "1330688706906038272",
      "name": "资产信息表",
      "code": "assets",
      "type": "TABLE",
      "moduleId": "1330687074365480960",
      "moduleName": null,
      "species": "BIS",
      "description": null,
      "gmtCreate": 1606095885391,
      "modifiedBy": "1295915065878388737",
      "gmtModified": 1606101802641,
      "hadAuxTable": null,
      "auxTable": null,
      "treeTable": null,
      "columns": [
        {
          "id": "1330695218734964737",
          "name": "存放区域",
          "code": "area",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "required": "false",
            "regular": "",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204096",
          "name": "创建人主键",
          "code": "create_user_id",
          "fieldType": "INT",
          "fieldSize": 20,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330695218734964742",
          "name": "库存状态",
          "code": "stock_status",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "DICT",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "required": "true",
            "regular": "",
            "unique": "false"
          },
          "dictionaryForeign": {
            "id": "1330695218734964747",
            "fieldId": "1330695218734964742",
            "fieldName": "库存状态",
            "fieldCode": "stock_status",
            "refTableName": "库存状态",
            "refTableId": "1330691572144152576",
            "refTableCode": "dict_kucunzhuangtai",
            "refFieldCode": "code",
            "refFieldType": "STRING",
            "refFieldSize": 32,
            "refDisplayFieldCode": "name",
            "species": "BIS",
            "createdBy": null,
            "modifiedBy": null
          },
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204104",
          "name": "创建时间",
          "code": "create_time",
          "fieldType": "DATE_TIME",
          "fieldSize": 0,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204103",
          "name": "创建人名称",
          "code": "create_user_name",
          "fieldType": "STRING",
          "fieldSize": 255,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {},
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204106",
          "name": "数据版本",
          "code": "data_version",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330713525525553154",
          "name": "所属部门",
          "code": "department_id",
          "fieldType": "INT",
          "fieldSize": 20,
          "dataType": "QUOTE",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "regular": "",
            "required": "true",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330695218734964748",
          "name": "库存数量",
          "code": "stock_num",
          "fieldType": "INT",
          "fieldSize": 8,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "regular": "",
            "required": "false",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204111",
          "name": "最后修改人主键",
          "code": "last_update_user_id",
          "fieldType": "INT",
          "fieldSize": 20,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330689707302068231",
          "name": "资产类型",
          "code": "assets_type",
          "fieldType": "STRING",
          "fieldSize": 33,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "required": "false",
            "regular": "",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204098",
          "name": "最后修改时间",
          "code": "last_update_time",
          "fieldType": "DATE_TIME",
          "fieldSize": 0,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204100",
          "name": "排序序号",
          "code": "sequence",
          "fieldType": "INT",
          "fieldSize": 8,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true",
            "unique": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330695218734964753",
          "name": "存放建筑",
          "code": "build",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "regular": "",
            "required": "false",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330689707302068236",
          "name": "资产编码",
          "code": "assets_code",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "required": "true",
            "regular": "",
            "unique": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204108",
          "name": "主键",
          "code": "id",
          "fieldType": "INT",
          "fieldSize": 20,
          "dataType": "PK",
          "species": "SYS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "required": "true",
            "unique": "true"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330695218734964758",
          "name": "存放楼层",
          "code": "floor",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "required": "false",
            "regular": "",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330689707302068241",
          "name": "资产名称",
          "code": "assets_name",
          "fieldType": "STRING",
          "fieldSize": 32,
          "dataType": "NORMAL",
          "species": "BIS",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {
            "pinyinConvent": "false",
            "regular": "",
            "required": "false",
            "unique": "false"
          },
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        },
        {
          "id": "1330688706931204113",
          "name": "最后修改人名称",
          "code": "last_update_user_name",
          "fieldType": "STRING",
          "fieldSize": 255,
          "dataType": "NORMAL",
          "species": "SYS_TMPL",
          "decimalSize": 0,
          "sequence": null,
          "fieldProperty": {},
          "dictionaryForeign": null,
          "createdBy": null,
          "modifiedBy": null
        }
      ],
      "references": [
        {
          "id": "1330713525525553159",
          "fieldId": "1330713525525553154",
          "fieldName": "所属部门",
          "fieldCode": "department_id",
          "refTableId": "1330690108524994560",
          "refTableCode": "location",
          "refFieldCode": "id",
          "refFieldType": "INT",
          "refFieldSize": 20,
          "refDisplayFieldCode": "name",
          "sequence": 1,
          "species": "BIS",
          "createdBy": null,
          "modifiedBy": null
        }
      ],
      "foreignKeys": [],
      "relationTables": [],
      "createdBy": null
    },
    "createdBy": null,
    "modifiedBy": null
  },
  "treeTable": null,
  "columns": [
    {
      "id": "1330688851601137665",
      "name": "外键",
      "code": "fid",
      "fieldType": "INT",
      "fieldSize": 20,
      "dataType": "FK",
      "species": "BIS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851601137667",
      "name": "创建人主键",
      "code": "create_user_id",
      "fieldType": "INT",
      "fieldSize": 20,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851605331971",
      "name": "创建时间",
      "code": "create_time",
      "fieldType": "DATE_TIME",
      "fieldSize": 0,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851605331970",
      "name": "创建人名称",
      "code": "create_user_name",
      "fieldType": "STRING",
      "fieldSize": 255,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {},
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851605331973",
      "name": "数据版本",
      "code": "data_version",
      "fieldType": "STRING",
      "fieldSize": 32,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330696410496114689",
      "name": "资产维保结束时间",
      "code": "ent_time",
      "fieldType": "DATE",
      "fieldSize": 0,
      "dataType": "NORMAL",
      "species": "BIS",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "pinyinConvent": "false",
        "required": "true",
        "regular": "",
        "unique": "false"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851605331978",
      "name": "最后修改人主键",
      "code": "last_update_user_id",
      "fieldType": "INT",
      "fieldSize": 20,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851601137669",
      "name": "最后修改时间",
      "code": "last_update_time",
      "fieldType": "DATE_TIME",
      "fieldSize": 0,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851601137671",
      "name": "排序序号",
      "code": "sequence",
      "fieldType": "INT",
      "fieldSize": 8,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true",
        "unique": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330696410496114694",
      "name": "资产维保开始时间",
      "code": "start_time",
      "fieldType": "DATE",
      "fieldSize": 0,
      "dataType": "NORMAL",
      "species": "BIS",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "pinyinConvent": "false",
        "required": "true",
        "regular": "",
        "unique": "false"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330696410496114699",
      "name": "生产厂商",
      "code": "producer",
      "fieldType": "STRING",
      "fieldSize": 32,
      "dataType": "DICT",
      "species": "BIS",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "pinyinConvent": "false",
        "required": "false",
        "regular": "",
        "unique": "false"
      },
      "dictionaryForeign": {
        "id": "1330696410496114704",
        "fieldId": "1330696410496114699",
        "fieldName": "生产厂商",
        "fieldCode": "producer",
        "refTableName": "生产厂商",
        "refTableId": "1330691289989128192",
        "refTableCode": "dict_shengchanchangshang",
        "refFieldCode": "code",
        "refFieldType": "STRING",
        "refFieldSize": 32,
        "refDisplayFieldCode": "name",
        "species": "BIS",
        "createdBy": null,
        "modifiedBy": null
      },
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851605331975",
      "name": "主键",
      "code": "id",
      "fieldType": "INT",
      "fieldSize": 20,
      "dataType": "PK",
      "species": "SYS",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "required": "true",
        "unique": "true"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330716787356082176",
      "name": "父设备",
      "code": "p_device",
      "fieldType": "INT",
      "fieldSize": 20,
      "dataType": "QUOTE",
      "species": "BIS",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {
        "pinyinConvent": "false",
        "required": "false",
        "regular": "",
        "unique": "false"
      },
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    },
    {
      "id": "1330688851605331980",
      "name": "最后修改人名称",
      "code": "last_update_user_name",
      "fieldType": "STRING",
      "fieldSize": 255,
      "dataType": "NORMAL",
      "species": "SYS_TMPL",
      "decimalSize": 0,
      "sequence": null,
      "fieldProperty": {},
      "dictionaryForeign": null,
      "createdBy": null,
      "modifiedBy": null
    }
  ],
  "references": [
    {
      "id": "1330716787356082181",
      "fieldId": "1330716787356082176",
      "fieldName": "父设备",
      "fieldCode": "p_device",
      "refTableId": "1330688706906038272",
      "refTableCode": "assets",
      "refFieldCode": "id",
      "refFieldType": "INT",
      "refFieldSize": 20,
      "refDisplayFieldCode": "assets_code",
      "sequence": 1,
      "species": "BIS",
      "createdBy": null,
      "modifiedBy": null
    }
  ],
  "foreignKeys": [
    {
      "id": "1330688851596943360",
      "fieldId": "1330688851601137665",
      "fieldName": "外键",
      "fieldCode": "fid",
      "refTableId": "1330688706906038272",
      "refTableCode": "assets",
      "refFieldCode": "id",
      "refFieldType": "INT",
      "refFieldSize": 20,
      "refDisplayFieldCode": "id",
      "deleteStrategy": "CASCADE",
      "updateStrategy": "CASCADE",
      "sequence": 1,
      "species": "BIS_TMPL",
      "createdBy": null,
      "modifiedBy": null
    }
  ],
  "relationTables": [],
  "createdBy": null
};