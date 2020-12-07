import { 
  ConditionOperator, ComplexType,
  OpenType, PageType, ActionCollection, InterReqType, InterType,
  ConditionCollection,
  InterCollection, Ref2ValCollection
} from '@iub-dsl/definition';

export const interSetDataCollection: Ref2ValCollection = {
  inter3_set: {
    type: ComplexType.structArray,
    struct: [
      {
        key: '@(interMeta).1330690108524994560/1330690108566937616',
        value: '@(schema).id',
      },
      {
        key: '@(interMeta).1330690108524994560/1330690108566937605',
        value: '@(schema).mIEF110a' // 名称
      },
      {
        key: '@(interMeta).1330690108524994560/1330690108566937614',
        value: '@(schema).wnlmddk6/wnlmddk6_id1' // 上级位置id
      },
      {
        key: '@(interMeta).1330690108524994560/1330692953483649025',
        value: '@(schema).hZuHwTTk/code' // 位置类型
      }
    ]
  },
  mIEF110a: {
    type: ComplexType.structObject,
    struct: [
      {
        value: '@(runCtx).payload', // 来源: 固定值, 表达式, 后端数据
        key: '@(schema).mIEF110a', // 目标: 页面变量的标示位
      }
    ]
  },
  wnlmddk6_set: {
    type: ComplexType.structObject,
    struct: [
      {
        // 需要根据打开目标{页面输出回填, 如何对应问题}
        value: '@(runCtx).payload', // 来源: 固定值, 表达式, 后端数据
        key: '@(schema).mIEF110a', // 目标: 页面变量的标示位
      }
    ]
  },
  hZuHwTTk_s: {
    type: ComplexType.structArray,
    struct: [
      // {
      //   value: '@(runCtx).payload', // 根据meta转换成schema
      //   key: '@(schema).hZuHwTTk_Arr',
      // },
      // {
      //   value: '固定值',
      //   key: '@(schema).hZuHwTTk[#(idx)]/hZuHwTTk_id2',
      // },
      {
        value: '@(runCtx).payload[#(idx)]/code',
        key: '@(schema).hZuHwTTk[#(idx)]/hZuHwTTk_id1',
      },
      {
        value: '@(runCtx).payload[#(idx)]/name',
        key: '@(schema).hZuHwTTk[#(idx)]/hZuHwTTk_id2',
      },
      // {
      //   key: '@(schema).hZuHwTTk[#(idx)]/hZuHwTTk_id3',
      //   value: {
      //     type: ComplexType.structArray,
      //     /** 树形结构, 结构一致 */
      //     struct: []
      //   }
      // }
    ]
  },
  hZuHwTTk_onchange: {
    type: ComplexType.structObject,
    struct: [
      {
        /** 第一种, 整个表转换的 */
        value: '@(runCtx).payload', // 根据meta转换成schema
        key: '@(schema).hZuHwTTk', // TODO onChange仅拿到单个值, 需要转换、 可以在event统一转换
      }
      /** 
       * 第二种, 一对一, 这种其实也是和元数据强绑定
       * 第三种, 纯配置的一一对应, 其实也跟元数据对应, 仅是多了配置工作而言
       * 反思: 弹窗传值, 同理 其实也无法脱离元数据, 如果是赋值其他, 那么, 可以同时赋值给多个, 也可以验证复杂赋值
       */
      // {
      //   from: '@(runCtx).payload/code',
      //   : '@(schema).hZuHwTTk/hZuHwTTk_id1',
      // },
      // {
      //   from: '@(runCtx).payload/name',
      //   : '@(schema).hZuHwTTk/hZuHwTTk_id2',
      // }
    ]
  }
};

export const interCollection: InterCollection = {
  inter1: {
    interReqType: InterReqType.APBDSL,
    interList: {
      inter1: {
        interType: InterType.R,
        inter: '@(interMeta).1330690535979098112',
      }
    },
    interStep: ['inter1']
  },
  inter2: {
    interReqType: InterReqType.APBDSL,
    interList: {
      interId1: {
        interType: InterType.R,
        inter: '@(interMeta).1330690108524994560',
        condition: '',
      }
    },
    interStep: ['interId1'],
  },
  inter3: {
    interReqType: InterReqType.APBDSL,
    interList: {
      interId1: {
        interType: InterType.C,
        inter: '@(interMeta).1330690108524994560',
        set: '@(ref2Value).inter3_set',
      }
    },
    interStep: ['interId1'],
  },
  inter4: {
    interReqType: InterReqType.APBDSL,
    interList: {
      interId1: {
        interType: InterType.U,
        inter: '@(interMeta).1330690108524994560',
        set: '@(ref2Value).inter3_set',
        condition: ''
      }
    },
    interStep: ['interId1'],
  },
};

export const actionCollection: ActionCollection = {
  mIEF110a: { // 文本框
    actionId: 'mIEF110a',
    actionName: 'changeState',
    actionType: 'changeState',
    actionOptions: {
      changeMapping: '@(ref2Value).mIEF110a',
    },
  },
  wnlmddk6: { // 打开页面, 传入配置
    actionId: 'wnlmddk6',
    actionName: 'openModalName',
    actionType: 'openPage',
    actionOptions: {
      openType: OpenType.modal,
      pageType: PageType.IUBDSL,
      pageUrl: '',
      emitConf: { // 传入的配置
        condition: '@(cond).wnlmddk6_act_cond1'
      },
    },
  },
  /**
   * 接收弹窗数据回填
   * 1. 用户配置的映射
   * 2. 系统生成的映射「选中项:「有默认字段,也可以配置,同时会把弹窗配置的配置传回本页面」 --> 目标: 默认是触发源「可以配置」」
   * 3. onClick, 确定时候触发
   */
  wnlmddk6_set: {
    actionId: 'wnlmddk6_set',
    actionName: 'changeState',
    actionType: 'changeState',
    actionOptions: {
      changeMapping: '@(ref2Value).wnlmddk6_set'
    },
  },
  // 1. 弹窗页面的配置告诉本页面如何回填
  // 2. 动作配置中就有配置说明如何回填

  // -----------------------------
  // 获取下拉框数据源, 数据源填入
  hZuHwTTk_d: { // 待修改
    actionId: 'hZuHwTTk_d',
    actionName: 'readInterface',
    actionType: 'interfaceRequest',
    actionOptions: {
      refType: 'inter',
      ref: '@(inter).inter1'
    }
  },
  // 下拉框数据回填
  hZuHwTTk_s: {
    actionId: 'hZuHwTTk_s',
    actionName: 'changeState',
    actionType: 'changeState',
    actionOptions: {
      changeMapping: '@(ref2Value).hZuHwTTk_s'
    },
  },
  // 下拉框onchange
  hZuHwTTk_onchange: {
    actionId: 'hZuHwTTk_onchange',
    actionName: 'changeState',
    actionType: 'changeState',
    actionOptions: {
      changeMapping: '@(ref2Value).hZuHwTTk_onchange'
    },
  },
  writeBack: {
    actionId: 'writeBack',
    actionType: 'interfaceRequest',
    actionName: 'writeBack',
    actionOptions: {
      refType: 'inter',
      ref: '@(inter).inter2'
    }
  },
  // 新增 TODO: 引用关系处理
  create_Interface_01: {
    actionId: 'create_Interface_01',
    actionType: 'interfaceRequest',
    actionName: 'create_Interface',
    actionOptions: {
      refType: 'inter',
      ref: '@(inter).inter2'
    }
  },
  // 修改
  update_Interface_01: {
    actionId: 'update_Interface_01',
    actionType: 'interfaceRequest',
    actionName: 'update_Interface_01',
    actionOptions: {
      refType: 'inter',
      ref: '@(inter).inter4'
    }
  },
  // 详情
  /** 继续拆分 */
  /**
   * condition、lowCode、ref2Value[dataCollect、dataSet]
   * dataObserve、refRelation
   */
};


export const actionCond: ConditionCollection = {
  wnlmddk6_act_cond1: {
    condition: {
      conditionList: {
        cond1: {
          operator: ConditionOperator.IN,
          exp1: '',
          exp2: '',
        },
      },
      conditionControl: {
        and: ['cond1']
      }
    }
  }
};



/**
 * 1. 组合请求与分发请求结果 + 节流
 * 2. 弹窗回填
 * 3. onMount获取数据,  [在未加入懒加载的时候, 在IUB页面的mounted获取, 加入懒加载后, 再扩展和修改]
 */

// 原子
/**
 * C
   // 引用和被引用的例子, 为了方便计算, 收集的时候需要记录
   // 最好的方式是收集的时候, 有额外的副作用处理, 这样处理引用的时候就可以快很多.
   // 像资产管理, 该接口/收集的字段是否生效, 需要有条件
 * interface: '',
 * set: [
 *  {
 *    collectKey: '',
 *    collectValue: '',
 *  }
 * ]
 * U
 * interface: '',
 * set: [],
 * condition: '@(cond).1'
 * D
 * interface: '',
 * condition: '',
 * R
 * interface: '',
 * page{分页管理}、needTotal(),
 * .... 「配置传递和共享的问题」
 * 引用关系拼接(AOP?已经拼接好X?) 「应该属于接口请求的插件」
 * XXX接口XXX字段引用了XXX表, 额外拼接
 * 多个请求组合起来的拼接
 */