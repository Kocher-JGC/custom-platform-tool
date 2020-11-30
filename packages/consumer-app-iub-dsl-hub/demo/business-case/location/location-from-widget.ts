import { WidgetCollection, AllWidgetType, FlowCollection } from "@iub-dsl/definition";

export const widgetFlowCollection: FlowCollection = {
  mIEF110a: {
    id: 'mIEF110a',
    actionId: '@(action).mIEF110a',
    flowOutCondition: [],
    flowOut: [],
  }
};

export const locationFromWidget: WidgetCollection = {
  mIEF110a: {
    widgetId: "mIEF110a",
    widgetRef: AllWidgetType.FormInput,
    widgetCode: "FormInput.0",
    propState: {
      widgetCode: "FormInput.0",
      realVal: '@(schema).mIEF110a',
      title: "位置名称",
    },
    eventHandlers: {
      onChange: {
        type: 'flowEventHandler',
        flowItemIds: [`@(flow).mIEF110a`]
      }
    }
  },
  wnlmddk6: {
    widgetId: "wnlmddk6",
    widgetRef: AllWidgetType.FormInput,
    widgetCode: "FormInput.1",
    propState: {
      widgetCode: "FormInput.1",
      realVal: '@(schema).wnlmddk6.wnlmddk6_id3',
      title: "上级位置",
    },
    eventHandlers: {
      onChange: {
        type: 'flowEventHandler',
        flowItemIds: [`@(flow).wnlmddk6`]
      }
    }
  },
  hZuHwTTk: {
    widgetId: "hZuHwTTk",
    widgetCode: "DropdownSelector.0",
    widgetRef: AllWidgetType.DropdownSelector,
    propState: {
      widgetCode: "DropdownSelector.0",
      realVal: '@(schema).hZuHwTTk.hZuHwTTk_id1',
      dataSource: "@(schema).hZuHwTTk_Arr",
      title: "位置类型",
    },
  }
};