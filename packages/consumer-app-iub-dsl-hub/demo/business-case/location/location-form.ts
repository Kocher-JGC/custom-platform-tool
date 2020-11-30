import { FoundationType, ComplexType, TypeOfIUBDSL } from '@iub-dsl/definition';
import { locationFromWidget, widgetFlowCollection } from "./location-from-widget";
import { locationInterface } from "./location-interface";
import { actionCollection, actionCond, interCollection, interSetDataCollection } from './location-form-action';

/** TODO: 如何共享数据 */
export const locationForm: TypeOfIUBDSL = {
  // id: "1330698339943063552",
  name: "测试页面",
  pageID: "1330698339943063552",
  type: 'config',
  layoutContent: {},
  widgetCollection: locationFromWidget,
  interMetaCollection: locationInterface as any,
  pageLifecycle: {
  },
  schema: {
    id: {
      fieldRef: "@(interMeta).1330690108524994560/1330690108566937616",
      type: FoundationType.string,
      defaultVal: '$ID()',
      desc: 'id'
    },
    mIEF110a: {
      fieldRef: "@(interMeta).1330690108524994560/1330690108566937616",
      type: FoundationType.string,
      desc: '位置名称',    
    },
    wnlmddk6: {
      type: ComplexType.structObject,
      interRef: "@(interMeta).1330690108524994560",
      desc: '上级信息',
      struct: {
        wnlmddk6_id1: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690108524994560/1330690108566937616",
          desc: '主键',
        },
        wnlmddk6_id2: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690108524994560/1330690108566937605",
          desc: '上级位置id',
        },
        wnlmddk6_id3: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690108524994560/1330690108566937614",
          desc: '位置名称',
        },
        wnlmddk6_id4: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690108524994560/1330692953483649025",
          desc: '位置类型',
        }
      }
    },
    hZuHwTTk: {
      type: ComplexType.structObject,
      desc: '位置类型',
      struct: {
        hZuHwTTk_id1: {
          type: FoundationType.string,
          // TODO 
          fieldRef: "@(interMeta).1330690535979098112/code",
          desc: 'code'
        },
        hZuHwTTk_id2: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690535979098112/name",
          desc: 'name'
        },
      }
    },
    hZuHwTTk_Arr: {
      type: ComplexType.structArray,
      desc: '位置类型下拉数据',
      struct: {
        hZuHwTTk_id1: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690535979098112/code",
          desc: 'code'
        },
        hZuHwTTk_id2: {
          type: FoundationType.string,
          fieldRef: "@(interMeta).1330690535979098112/name",
          desc: 'name'
        },
      }
    },
  },
  actionsCollection: Object.assign({}, actionCollection),
  flowCollection: Object.assign({}, widgetFlowCollection),
  /** hub数据 */
  conditionCollection: Object.assign({}, actionCond),
  ref2ValueCollection: Object.assign({}, interSetDataCollection),
  interCollection: Object.assign({}, interCollection),
  lowcodeCollection: {},
  /** TEMP */
  openPageUrl: '',
  isSearch: false,
  businessCode: [],
};
