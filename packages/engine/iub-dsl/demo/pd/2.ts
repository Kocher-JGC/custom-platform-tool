import { CommonCondition } from "@iub-dsl/definition";

export default {
  sysRtCxtInterface: {},
  schemas: {
    "1321031025366802436": {
      schemaId: "1321031025366802436", name: "主键", type: "string", fieldMapping: "@(metadata).1321031025329053696.1321031025366802436", isPk: true, fieldCode: "id", defaultVal: "$ID()"
    },
    "schema_ss-paFCD": { type: "string", fieldMapping: "@(metadata).1321031025329053696.1321031261006995466" },
    schema_lMYnJ6Hj: { type: "string", fieldMapping: "@(metadata).1321031025329053696.1321031261006995456" },
    schema_gcl50wFr: { type: "string", fieldMapping: "@(metadata).1321031025329053696.1321031261006995461" }
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
    KDfToAMw: {
      id: "KDfToAMw", compType: "FormInput", label: "用户名", title: "用户名", value: "@(schemas).schema_ss-paFCD", defValue: null, type: "componentRef", compCode: "KDfToAMw", actions: { onChange: { type: "actionRef", actionID: "@(flow).f_KDfToAMw" } }
    },
    e0BeGVs_: {
      id: "e0BeGVs_", compType: "FormInput", label: "地址", title: "地址", value: "@(schemas).schema_lMYnJ6Hj", defValue: null, type: "componentRef", compCode: "e0BeGVs_", actions: { onChange: { type: "actionRef", actionID: "@(flow).f_e0BeGVs_" } }
    },
    "6jBAxlGp": {
      id: "6jBAxlGp", compType: "FormInput", label: "描述", title: "描述", value: "@(schemas).schema_gcl50wFr", defValue: "随便说点什么~~!11", type: "componentRef", compCode: "6jBAxlGp", actions: { onChange: { type: "actionRef", actionID: "@(flow).f_6jBAxlGp" } }
    },
    RbAPem6Z: {
      id: "RbAPem6Z", compType: "NormalButton", title: "提交", label: "提交", text: "提交", type: "componentRef", actions: { onClick: { type: "actionRef", actionID: "@(flow).f_middle" } }
    }
  },
  actionsCollection: {
    KDfToAMw: {
      actionId: "KDfToAMw", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).schema_ss-paFCD" }, actionOutput: "undefined"
    },
    e0BeGVs_: {
      actionId: "e0BeGVs_", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).schema_lMYnJ6Hj" }, actionOutput: "undefined"
    },
    "6jBAxlGp": {
      actionId: "6jBAxlGp", actionName: "updateState", actionType: "updateState", actionOptions: { changeTarget: "@(schemas).schema_gcl50wFr" }, actionOutput: "undefined"
    },
    actions_ckK0BdL8: {
      actionId: "actions_ckK0BdL8",
      actionName: "新增",
      actionType: "APBDSLCURD",
      actionOptions: {
        businesscode: "34562",
        actionList: {
          apbId1: {
            type: "TableInsert",
            table: "@(metadata).1321031025329053696",
            fieldMapping: {
              collectionType: "structObject",
              struct: [
                { field: "@(metadata).1321031025329053696.1321031025366802436", collectField: "@(schemas).1321031025366802436" },
                { field: "@(metadata).1321031025329053696.1321031261006995466", collectField: "@(schemas).schema_ss-paFCD" },
                { field: "@(metadata).1321031025329053696.1321031261006995456", collectField: "@(schemas).schema_lMYnJ6Hj" },
                { field: "@(metadata).1321031025329053696.1321031261006995461", collectField: "@(schemas).schema_gcl50wFr" }
              ]
            }
          }
        },
        actionStep: ["apbId1"]
      },
      actionOutput: "undefined"
    },
    actions_ckK0BdL9: {
      actionId: "actions_ckK0BdL9",
      actionName: "修改",
      actionType: "APBDSLCURD",
      actionOptions: {
        businesscode: "34562",
        actionList: {
          apbId1: {
            type: "TableUpdate",
            table: "@(metadata).1321031025329053696",
            fieldMapping: {
              collectionType: "structObject",
              struct: [
                { field: "@(metadata).1321031025329053696.1321031025366802436", collectField: "@(schemas).1321031025366802436" },
                { field: "@(metadata).1321031025329053696.1321031261006995466", collectField: "@(schemas).schema_ss-paFCD" },
                { field: "@(metadata).1321031025329053696.1321031261006995456", collectField: "@(schemas).schema_lMYnJ6Hj" },
                { field: "@(metadata).1321031025329053696.1321031261006995461", collectField: "@(schemas).schema_gcl50wFr" }
              ]
            },
            condition: {
              conditionControl: { and: ["0_0"] },
              conditionList: { "0_0": { operator: "equ", exp1: "@(metadata).1321031025329053696.1321031025366802436", exp2: '@(schemas).1321031025366802436' } }
            }
          }
        },
        actionStep: ["apbId1"]
      },
      actionOutput: "undefined"
    },
    actions_ckK0BdL0: {
      actionId: "actions_ckK0BdL0",
      actionName: "删除",
      actionType: "APBDSLCURD",
      actionOptions: {
        businesscode: "34562",
        actionList: {
          apbId1: {
            type: "TableDelete",
            table: "@(metadata).1321031025329053696",
            condition: {
              conditionControl: { and: ["0_0"] },
              conditionList: { "0_0": { operator: "equ", exp1: "@(metadata).1321031025329053696.1321031025366802436", exp2: '@(schemas).1321031025366802436' } }
            }
          }
        },
        actionStep: ["apbId1"]
      },
      actionOutput: "undefined"
    }
  },
  flowCollection: {
    f_KDfToAMw: {
      id: "f_KDfToAMw", actionId: "@(actions).KDfToAMw", flowOutCondition: [], flowOut: [[]]
    },
    f_e0BeGVs_: {
      id: "f_e0BeGVs_", actionId: "@(actions).e0BeGVs_", flowOutCondition: [], flowOut: [[]]
    },
    f_6jBAxlGp: {
      id: "f_6jBAxlGp", actionId: "@(actions).6jBAxlGp", flowOutCondition: [], flowOut: [[]]
    },
    f_middle: {
      id: "f_middle",
      actionId: "",
      flowOutCondition: [
        {
          condition: {},
          when: ['']
        },
        {
          condition: {},
          when: ['updateStatus']
        },
        {
          condition: {},
          when: ['deleteStatus']
        },
      ] as CommonCondition[],
      flowOut: [
        ['f_actions_ckK0BdL8'],
        ['f_actions_ckK0BdL9'],
        ['f_actions_ckK0BdL0']
      ]
    },
    f_actions_ckK0BdL8: {
      id: "f_actions_ckK0BdL8", actionId: "@(actions).actions_ckK0BdL8", flowOutCondition: [], flowOut: [[]]
    },
    f_actions_ckK0BdL9: {
      id: "f_actions_ckK0BdL9", actionId: "@(actions).actions_ckK0BdL9", flowOutCondition: [], flowOut: [[]]
    },
    f_actions_ckK0BdL0: {
      id: "f_actions_ckK0BdL0", actionId: "@(actions).actions_ckK0BdL0", flowOutCondition: [], flowOut: [[]]
    },

  },
  layoutContent: {
    type: "general",
    content: [{
      id: "KDfToAMw",
      label: "文本框",
      editableProps: {
        title: { type: "string" }, titleColor: { type: "string" }, defValue: { type: "any" }, field: { type: "struct" }
      },
      type: "componentRef",
      compType: "FormInput",
      widgetCode: "KDfToAMw",
      labelColor: null,
      title: "用户名",
      defValue: null,
      exp: null,
      variable: null,
      field: "schema_ss-paFCD",
      componentID: "KDfToAMw",
      refID: "KDfToAMw"
    }, {
      id: "e0BeGVs_",
      label: "文本框",
      editableProps: {
        title: { type: "string" }, titleColor: { type: "string" }, defValue: { type: "any" }, field: { type: "struct" }
      },
      type: "componentRef",
      compType: "FormInput",
      widgetCode: "e0BeGVs_",
      labelColor: null,
      title: "地址",
      defValue: null,
      exp: null,
      variable: null,
      field: "schema_lMYnJ6Hj",
      componentID: "e0BeGVs_",
      refID: "e0BeGVs_"
    }, {
      id: "6jBAxlGp",
      label: "文本框",
      editableProps: {
        title: { type: "string" }, titleColor: { type: "string" }, defValue: { type: "any" }, field: { type: "struct" }
      },
      type: "componentRef",
      compType: "FormInput",
      widgetCode: "6jBAxlGp",
      labelColor: null,
      title: "描述",
      defValue: "随便说点什么~~!11",
      exp: null,
      variable: null,
      field: "schema_gcl50wFr",
      componentID: "6jBAxlGp",
      refID: "6jBAxlGp"
    }, {
      id: "RbAPem6Z", editableProps: { title: { type: "string" } }, label: "动作按钮", type: "componentRef", compType: "FormButton", title: "提交", actionRef: "f_middle", componentID: "RbAPem6Z", refID: "RbAPem6Z"
    }]
  },
  pageID: "1321030671367544832",
  name: "测试页面",
  type: "config"
};
