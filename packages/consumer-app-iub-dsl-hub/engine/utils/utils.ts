export const noopError = (...args) => { 
  // console.error('空函数, 空调用~~!!', args); return false;
};

export const sleep = (time = 1) => new Promise(
  (resolve) => setTimeout(() => resolve(), time * 1000)
);

export const pickObj = (obj, keys: string[]) => {
  return keys.reduce((res, k) => ({ ...res, [k]: obj[k] }), {});
};

export const noopTrueFn = () => true;

export const reSetFuncWrap = (keyArr: string[], list: { [str: string]: any }) => {
  return (transfFn: (fn: any, key: string) => any) => {
    keyArr.forEach(key => {
      const fn = list[key];
      const newFn = transfFn(fn, key);
      if (typeof newFn === 'function') {
        list[key] = newFn;
      }
    });
  };
};

const keyword = [
  /** 部分关键字 */
  '(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
  'return', 'case', 'delete', 'throw', 'void',
  /** assignment operators 赋值操作符 */
  '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
  '&=', '|=', '^=', ',',
  /** 二元/一元  操作符 binary/unary operators */
  '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
  '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
  '<=', '<', '>', '!=', '!=='
];