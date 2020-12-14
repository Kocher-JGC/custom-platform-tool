import at from "lodash/at";

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
    console.error(`需要传入 nestingInfo，否则不要调用此方法，请检查调用链路`);
  }
  const _nestingInfo = [...nestingInfo];
  const targetItemIdx = _nestingInfo.pop() as number;

  const containerIdx = _nestingInfo;

  if(containerIdx.length === 0) {
    return nestingData[targetItemIdx];
  }
  const sourceItemNestIdxStr = `[${containerIdx.join('][')}]`;
  const targetItem = at(nestingData, [sourceItemNestIdxStr])[0];
  if(targetItem[nestingKey]) {
    const resData = targetItem[nestingKey][targetItemIdx];
    return resData;
  } 
  console.error(`没找到嵌套的容器元素`, targetItem);
};

export const getItemFromNestingItemsByBody = <T>(
  nestingData: T[],
  nestingInfo: number[],
): T => {
  return getItemFromNestingItems(nestingData, nestingInfo, 'body');
};
