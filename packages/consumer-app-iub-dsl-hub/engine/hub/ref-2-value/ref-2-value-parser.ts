import { RunTimeCtxToBusiness } from '../../runtime/types';
import { isRef2Value, isInterMeta, pickInterMetaMark, isPayload, pickPayloadMark } from '../../IUBDSL-mark';
import { Ref2ValueCollection, Ref2ValueOfComplex, ComplexType, TransfMapping, Ref2ValueOfArr } from '@iub-dsl/definition';

/**
 * ref2Value, 目的是转换值, 将引用转换为实际
 * 1. get, key/value都需要转换
 * 2. set, value,需要转换, 但是key也是有规律的
 * TODO ComplexType.structArray 比较复杂后续再优化各种情况
 */

/**
 * get: key需要转换, value也需要, object, array/没有标记就是下级所有?, 有标价根据获取标记获取
 * array: 
 *  1. 不能参与循环的, 视为第一个固定值
 *  2. 参与循环的「固定次数idx、最小idx、最大idx」「需要获取可以循环的元素」
 *  3. 可以递归, 且注意递归的层数
 *  4. 如果是全量应该注意优化
 *  5. 参照物? schema、payload
 * set: 
 *  1. 如何加速转换或者不转换? 「加速转换: 记录」 「不转换: 结构一直」
 *  
 */


const tranfFn = (struct: TransfMapping[], ctx) => {
  const { transfKey, transfVal  } = ctx;
  const transfRes = struct.reduce((res, { value, key }, idx) => {
    res[transfKey(key, idx, struct)] = typeof value === 'string' ? transfVal(value, idx, struct) : tranfScheduler(value, ctx);
    return res;
  }, {});
  return transfRes;
};

const tranfObj = (struct: TransfMapping[], ctx) => {
  const { transfKey, transfVal  } = ctx;
  const transfRes = struct.reduce((res, { value, key }, idx) => {
    const realKey = transfKey(key, idx, struct);
    const realVal = transfVal(value, idx, struct);
    res[realKey] = realVal;
    return res;
  }, {});
  return transfRes;
};

const tranfArr = (p: Ref2ValueOfArr, ctx) => {
  const { transfKey, transfVal  } = ctx;
  if (typeof p.struct?.[0] === 'string') {
    return (p.struct as string[]).map(transfVal);
  } else {
    return tranfObj(p.struct, ctx);
  }
};

 
export const tranfScheduler = (p: Ref2ValueOfComplex, ctx) => {
  const { transfKey, transfVal  } = ctx;
  if (p.type === ComplexType.structArray) {
    if (typeof p.struct?.[0] === 'string') {
      return (p.struct as string[]).map(transfVal);
    } else {
      return tranfFn(p.struct as TransfMapping[], ctx);
    }
  }
  if (p.type === ComplexType.structObject) {
    return tranfFn(p.struct, ctx);
  }
  return null;
};

const fn = (params) => {
  
};

 

export const ref2ValueParser = (ref2ValueC: Ref2ValueCollection) => {

  const ref2ValueKeys  = Object.keys(ref2ValueC);
  const ref2ValueList = {};

  /**
    inter3_set: {
    type: ComplexType.structArray,
    struct: [
      {
        key: '@(interMeta).1330690108524994560/1330690108566937616',
        value: '@(schema).id',
      },
    ]
  },
 */
  const collectKeys = []; /** 收集key不变, 写入, key会变 */

  ref2ValueKeys.forEach((key) => {
    console.log(ref2ValueC[key]);
    ref2ValueList[key] = ref2ValueC[key];
  });

  const bindRef2Value = (ref2ValueId: string) => {
    if (isRef2Value(ref2ValueId)) {
      return (ctx: RunTimeCtxToBusiness) => {
        const { action } = ctx;
        const transfKey = (key, idx, struct) => {
          if (isInterMeta(key)) {
            // @(meta) --> username
            return pickInterMetaMark(key);
          } else {
            // 1. @(schema) --> username
            // 2. username --> @(schema)
            // 3. username --> @(meta)
          }
        };
        const transfVal = (val, idx, struct) => {
          if (isPayload(val)) {
            val = pickPayloadMark(val);
            if (val === '') {
              return action?.payload;
            }
          }
        };
      };
    } else {
      console.error('错误的绑定, 非ref2Value');
      return (ctx) => {
        console.error('错误的调用, 非ref2Value');
        return null;
      };
    }
  };
  
  return {
    bindRef2Value,
    ref2ValueKeys,
    ref2ValueList
  };
};
