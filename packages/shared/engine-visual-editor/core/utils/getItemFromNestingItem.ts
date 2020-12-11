/**
 * 获取嵌套数据中的某个项的方法
 * @example
 *
 * nestingData = [{
 *  body: nestingData
 * }]
 *
 * @param nestingData 嵌套数据
 * @param nestingInfo 嵌套信息 [0, 1, 2]
 * @param nestingKey 嵌套节点的 key
 */
export const getItemFromNestingItems = <T>(
  nestingData: T[],
  nestingInfo: number[],
  nestingKey: string
): T => {
  if (!nestingInfo) {
    throw Error('需要传入 nestingInfo，否则不要调用此方法，请检查调用链路');
  }
  const _nestingInfo = [...nestingInfo];
  const targetItemIdx = _nestingInfo.pop() as number;
  if(_nestingInfo.length === 0) {
    return nestingData[targetItemIdx];
  }
  let resData;
  const recusive = (d, deep: number) => {
    const i = _nestingInfo[deep];
    const _d = d[i];
    const nextDeep = deep++;
    if (_d && _d[nestingKey] && typeof _nestingInfo[nextDeep] !== 'undefined') {
      recusive(_d[nestingKey], nextDeep);
    } else {
      resData = _d;
    }
  };
  recusive(nestingData, 0);
  return resData;
};

export const getItemFromNestingItemsByBody = <T>(
  nestingData: T[],
  nestingInfo: number[],
): T => {
  return getItemFromNestingItems(nestingData, nestingInfo, 'body');
};
