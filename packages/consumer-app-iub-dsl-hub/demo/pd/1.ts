export default {
  sysRtCxtInterface: {},
  schemas: {
    "1321031025329053696": {
      schemaId: "1321031025329053696",
      collectionType: "structArray",
      struct: [{
        name: "地址", schemaId: "1321031261006995456", type: "string", fieldCode: "address", fieldMapping: "@(metadata).1321031025329053696.1321031261006995456"
      }, {
        name: "描述", schemaId: "1321031261006995461", type: "string", fieldCode: "description", fieldMapping: "@(metadata).1321031025329053696.1321031261006995461"
      }, {
        schemaId: "1321031025366802436", name: "主键", type: "string", fieldMapping: "@(metadata).1321031025329053696.1321031025366802436", isPk: true, fieldCode: "id", defaultVal: "$ID()"
      }, {
        name: "用户名", schemaId: "1321031261006995466", type: "string", fieldCode: "username", fieldMapping: "@(metadata).1321031025329053696.1321031261006995466"
      }]
    },
    "1321031261006995456": {
      name: "地址", schemaId: "1321031261006995456", type: "string", fieldCode: "address", fieldMapping: "@(metadata).1321031025329053696.1321031261006995456"
    },
    "1321031261006995461": {
      name: "描述", schemaId: "1321031261006995461", type: "string", fieldCode: "description", fieldMapping: "@(metadata).1321031025329053696.1321031261006995461"
    },
    "1321031025366802436": {
      schemaId: "1321031025366802436", name: "主键", type: "string", fieldMapping: "@(metadata).1321031025329053696.1321031025366802436", isPk: true, fieldCode: "id", defaultVal: "$ID()"
    },
    "1321031261006995466": {
      name: "用户名", schemaId: "1321031261006995466", type: "string", fieldCode: "username", fieldMapping: "@(metadata).1321031025329053696.1321031261006995466"
    }
  },
  metadataCollection: [{
    id: "1321031025329053696",
    name: "用户_K",
    code: "yonghu_k",
    type: "general",
    moduleId: "",
    columns: {
      "1321031261006995456": {
        id: "1321031261006995456", name: "地址", fieldCode: "address", fieldType: "STRING", fieldSize: 128, dataType: "NORMAL", colDataType: "NORMAL", type: "string"
      },
      "1321031261006995461": {
        id: "1321031261006995461", name: "描述", fieldCode: "description", fieldType: "STRING", fieldSize: 128, dataType: "NORMAL", colDataType: "NORMAL", type: "string"
      },
      "1321031025366802436": {
        id: "1321031025366802436", name: "主键", fieldCode: "id", fieldType: "INT", fieldSize: 20, dataType: "PK", colDataType: "PK", type: "string"
      },
      "1321031261006995466": {
        id: "1321031261006995466", name: "用户名", fieldCode: "username", fieldType: "STRING", fieldSize: 32, dataType: "NORMAL", colDataType: "NORMAL", type: "string"
      }
    }
  }],
  relationshipsCollection: {},
  componentsCollection: {
    "1321031261006995456": {
      id: "1321031261006995456", compType: "FormInput", label: "地址", title: "地址", value: "@(schemas).1321031261006995456", defValue: null, type: "componentRef", compCode: "1321031261006995456", actions: { onChange: { type: "actionRef", actionID: "@(flow).f_1321031261006995456" } }
    },
    "1321031261006995461": {
      id: "1321031261006995461", compType: "FormInput", label: "描述", title: "描述", value: "@(schemas).1321031261006995461", defValue: null, type: "componentRef", compCode: "1321031261006995461", actions: { onChange: { type: "actionRef", actionID: "@(flow).f_1321031261006995461" } }
    },
    "1321031261006995466": {
      id: "1321031261006995466", compType: "FormInput", label: "用户名", title: "用户名", value: "@(schemas).1321031261006995466", defValue: null, type: "componentRef", compCode: "1321031261006995466", actions: { onChange: { type: "actionRef", actionID: "@(flow).f_1321031261006995466" } }
    },
    button_1321031025329053696: {
      id: "button_1321031025329053696", compType: "NormalButton", title: "查询", label: "查询", text: "查询", type: "componentRef", actions: { onClick: { type: "actionRef", actionID: "@(flow).f_button_1321031025329053696" } }
    },
    QYFCuvHf: {
      id: "QYFCuvHf", compType: "NormalButton", title: "提交", label: "提交", text: "提交", type: "componentRef", actions: { onClick: { type: "actionRef", actionID: "@(flow).f_actions_4I4bjEuu" } }
    },
    xPy2vhMP: {
      id: "xPy2vhMP", label: "表格", type: "componentRef", compType: "NormalTable", columns: [{ dataIndex: "address", key: "1321031261006995456", title: "地址" }, { dataIndex: "description", key: "1321031261006995461", title: "描述" }, { dataIndex: "username", key: "1321031261006995466", title: "用户名" }], dataSource: "@(schemas).1321031025329053696"
    }
  },
  actionsCollection: {
    "1321031261006995456": {
      actionId: "1321031261006995456", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).1321031261006995456" }, actionOutput: "undefined"
    },
    "1321031261006995461": {
      actionId: "1321031261006995461", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).1321031261006995461" }, actionOutput: "undefined"
    },
    "1321031261006995466": {
      actionId: "1321031261006995466", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).1321031261006995466" }, actionOutput: "undefined"
    },
    button_1321031025329053696: {
      actionId: "button_1321031025329053696", actionName: "button_1321031025329053696TableSelect", actionType: "APBDSLCURD", actionOptions: { businesscode: "34562", actionList: { apbA1: { type: "TableSelect", table: "@(metadata).1321031025329053696", condition: { conditionControl: { and: ["0_0", "1_1", "3_3"] }, conditionList: { "0_0": { operator: "like", exp1: "@(metadata).1321031025329053696.1321031261006995456", exp2: "@(schemas).1321031261006995456" }, "1_1": { operator: "like", exp1: "@(metadata).1321031025329053696.1321031261006995461", exp2: "@(schemas).1321031261006995461" }, "3_3": { operator: "like", exp1: "@(metadata).1321031025329053696.1321031261006995466", exp2: "@(schemas).1321031261006995466" } } } } }, actionStep: ["apbA1"] }, actionOutput: "string"
    },
    button_1321031025329053696_U: {
      actionId: "button_1321031025329053696_U", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).1321031025329053696" }, actionOutput: "undefined"
    },
    actions_cPh0TJ3U: {
      actionId: "actions_cPh0TJ3U", actionName: "openModal_actions_cPh0TJ3U", actionType: "openModal", actionOptions: { type: "iub-dsl", pageUrl: "1321030671367544832", triggerAction: "openPage" }, actionOutput: "undefined"
    },
    actions_4I4bjEuu: {
      actionId: "actions_4I4bjEuu", actionName: "openModal_actions_4I4bjEuu", actionType: "openModal", actionOptions: { type: "iub-dsl", pageUrl: "1321030671367544832", triggerAction: "openPage" }, actionOutput: "undefined"
    }
  },
  flowCollection: {
    f_1321031261006995456: {
      id: "f_1321031261006995456", actionId: "@(actions).1321031261006995456", flowOutCondition: [], flowOut: [[]]
    },
    f_1321031261006995461: {
      id: "f_1321031261006995461", actionId: "@(actions).1321031261006995461", flowOutCondition: [], flowOut: [[]]
    },
    f_1321031261006995466: {
      id: "f_1321031261006995466", actionId: "@(actions).1321031261006995466", flowOutCondition: [], flowOut: [[]]
    },
    f_button_1321031025329053696: {
      id: "f_button_1321031025329053696", actionId: "@(actions).button_1321031025329053696", flowOutCondition: [], flowOut: [["f_button_1321031025329053696_U"]]
    },
    f_button_1321031025329053696_U: {
      id: "f_button_1321031025329053696_U", actionId: "@(actions).button_1321031025329053696_U", flowOutCondition: [], flowOut: [[]]
    },
    f_actions_cPh0TJ3U: {
      id: "f_actions_cPh0TJ3U", actionId: "@(actions).actions_cPh0TJ3U", flowOutCondition: [], flowOut: [[]]
    },
    f_actions_4I4bjEuu: {
      id: "f_actions_4I4bjEuu", actionId: "@(actions).actions_4I4bjEuu", flowOutCondition: [], flowOut: [[]]
    }
  },
  layoutContent: {
    type: "general",
    content: [{
      id: "QYFCuvHf", editableProps: { title: { type: "string" } }, label: "动作按钮", type: "componentRef", compType: "FormButton", title: "提交", actionRef: "actions_4I4bjEuu", componentID: "QYFCuvHf", refID: "QYFCuvHf"
    }, {
      id: "xPy2vhMP", label: "表格", type: "componentRef", compType: "NormalTable", labelColor: null, componentID: "xPy2vhMP", refID: "xPy2vhMP"
    }]
  },
  pageID: "1321030788300546048",
  name: "测试页面",
  type: "config"
};
