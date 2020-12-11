export const locationForm = {
  content: [
    {
      id: "mIEF110d",
      widgetRef: "FormInput",
      varAttr: [
        {
          alias: "实际值",
          attr: "realVal",
          type: "string"
        },
        {
          alias: "显示值",
          attr: "showVal",
          type: "string"
        }
      ],
      propState: {
        field: "schema..mIEF110d",
        widgetCode: null,
        labelColor: null,
        title: "位置名称",
        realVal: null,
        exp: null,
        variable: null,
        checkFixedRule: "位置名称",
        checkCustomRule: "位置名称",
        checkTooltip: "位置名称"
      }
    },
    {
      id: "wnlmddk6",
      widgetRef: "FormInput",
      varAttr: [
        {
          alias: "实际值",
          attr: "realVal",
          type: "string"
        },
        {
          alias: "显示值",
          attr: "showVal",
          type: "string"
        }
      ],
      propState: {
        field: null,
        widgetCode: "FormInput.0",
        labelColor: null,
        title: "上级位置",
        realVal: null,
        exp: null,
        variable: null,
        checkFixedRule: null,
        checkCustomRule: null,
        checkTooltip: null
      }
    },
    {
      id: "hZuHwTTk",
      label: "下拉选择器",
      widgetRef: "DropdownSelector",
      propState: {
        field: null,
        widgetCode: "DropdownSelector.0",
        optDS: "ds.1330690535979098112",
        labelColor: null,
        title: "下拉选择",
        dropdownMultiple: null,
        startSearch: null,
        checkFixedRule: null,
        checkCustomRule: null,
        checkTooltip: null
      }
    }
  ],
  id: "1330698339943063552",
  name: "测试页面",
  pageID: "1330698339943063552",
  meta: {
    lastCompID: 0,
    dataSource: {
      "ds.1330690108524994560": {
        id: "1330690108524994560",
        name: "位置管理",
        code: "location",
        type: "TREE",
        treeTable: {
          maxLevel: 15,
          createdBy: null,
          modifiedBy: null
        },
        references: [
          {
            id: "1330690108558548992",
            fieldId: "1330690108566937605",
            fieldName: "父节点",
            fieldCode: "pid",
            refTableId: "1330690108524994560",
            refTableCode: "location",
            refFieldCode: "id",
            refFieldType: "INT",
            refFieldSize: 20,
            refDisplayFieldCode: "id",
            sequence: 1,
            species: "BIS_TMPL",
            createdBy: null,
            modifiedBy: null
          }
        ],
      },
      "ds.1330690535979098112": {
        name: "位置类型",
        id: "1330690535979098112",
        code: "dict_weizhileixing",
        items: []
      }
    },
    pageInterface: {},
    linkpage: {},
    schema: {
      "schema..mIEF110d": {
        column: {
          id: "1330690108566937614",
          name: "位置名称",
          code: "name",
          fieldType: "STRING",
          fieldSize: 32,
          dataType: "NORMAL",
          species: "BIS_TMPL",
          decimalSize: 0,
          sequence: null,
          fieldProperty: {
            required: true
          },
          dictionaryForeign: null,
          createdBy: null,
          modifiedBy: null
        },
        "tableInfo": {
          id: "1330690108524994560",
          name: "位置管理",
          type: "TREE"
        }
      }
    },
    actions: {},
    varRely: {
      "var.mIEF110d": {
        type: "widget",
        widgetRef: "mIEF110d",
        varAttr: [
          {
            alias: "实际值",
            attr: "realVal",
            type: "string"
          },
          {
            alias: "显示值",
            attr: "showVal",
            type: "string"
          }
        ]
      },
      "var.wnlmddk6": {
        type: "widget",
        widgetRef: "wnlmddk6",
        varAttr: [
          {
            alias: "实际值",
            attr: "realVal",
            type: "string"
          },
          {
            alias: "显示值",
            attr: "showVal",
            type: "string"
          }
        ]
      },
      "var.hZuHwTTk": {
        type: "widget",
        widgetRef: "hZuHwTTk"
      }
    },
    "_rely": {
      "var.mIEF110d": [
        "mIEF110d"
      ],
      "schema..mIEF110d": [],
      "var.wnlmddk6": [
        "wnlmddk6"
      ],
      "var.38yO55iD": [
        "38yO55iD"
      ],
      "var.hZuHwTTk": [
        "hZuHwTTk"
      ],
      "ds.1330690535979098112": []
    }
  }
};
