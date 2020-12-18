/**
 * 深层解除嵌套
 */
export const flattenDeep = (targetArr: any[], nestIndex: string) => {
  const res = [];
  const r = (_a, nestDeep = 0, nextNestingInfo: number[] = []) => {
    // 将嵌套的信息嵌入到 item 中
    const nestingInfo: number[] = [...nextNestingInfo];
    _a.forEach((item, idx) => {
      nestingInfo[nestDeep] = idx;
      const nextingInfoCtx = [...nestingInfo];
      item.nestingInfo = [...nestingInfo];
      if(item[nestIndex]) {
        r(item[nestIndex], nestDeep + 1, nextingInfoCtx);
      }
      res.push(item);
    });
  };
  r(targetArr);
  return res;
};

/**
 * 将嵌套的数组转为 nodeTree 结构
 */
export const flatArrayToNode = (items: any[], idKey = 'id') => {
  const array = flattenDeep(items, 'body');
  const resTree = {};
  array.forEach((item, idx) => {
    resTree[item[idKey]] = item;
  });
  return resTree;
};