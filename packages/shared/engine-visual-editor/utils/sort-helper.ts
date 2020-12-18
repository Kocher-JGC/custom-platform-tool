import at from "lodash/at";
import { ElemNestingInfo } from "@engine/layout-renderer";
import { getItemFromNestingItemsByBody } from "./getItemFromNestingItem";

export interface SetItem2NestingArrOptions {
  addItem?;
  spliceCount: number;
}

/**
 * 设置嵌套数组
 * @param array
 * @param nestingInfo
 * @param param2
 */
export function setItem2NestingArr(
  array: any[],
  toNestingInfo: ElemNestingInfo,
  { addItem, spliceCount = 0 }: SetItem2NestingArrOptions
) {
  const _toNestingInfo = [...toNestingInfo];
  const targetAddPosition = _toNestingInfo.pop() as number;
  if (_toNestingInfo.length === 0) {
    const spliceParams = [targetAddPosition, spliceCount];
    if (addItem) {
      spliceParams.push(addItem);
    }
    Array.prototype.splice.apply(array, spliceParams);
  } else {
    const recursive = (currDiveIdx) => {
      const currNestIdx = _toNestingInfo[currDiveIdx];
      const nextNestIdx = _toNestingInfo[currDiveIdx + 1];
      if (typeof nextNestIdx === "undefined") {
        // 取最后一个嵌套位置
        if (!array[currNestIdx]) {
          return console.log(`没有节点 ${_toNestingInfo}`);
        }
        if (!array[currNestIdx]?.body) {
          array[currNestIdx].body = [];
        }
        const _spliceParams = [targetAddPosition, spliceCount];
        if (addItem) {
          _spliceParams.push(addItem);
        }
        Array.prototype.splice.apply(array[currNestIdx].body, _spliceParams);
      } else {
        recursive(currDiveIdx + 1);
      }
    };
    recursive(0);
  }

  return array;
}

export interface SortingActionSwap {
  type: "swap";
  sourceItemNestIdx: ElemNestingInfo;
  swapItemNestIdx: ElemNestingInfo;
}

export interface SortingActionPull {
  type: "pull";
  sourceItemNestIdx: ElemNestingInfo;
  toNestIdx: ElemNestingInfo;
}

export interface SortingActionPut {
  /** 将元素推入到 */
  type: "put";
  /** 推入的容器 item 的 idx */
  putItemNestIdx: ElemNestingInfo;
  /** 源 item 的 idx */
  sourceItemNestIdx: ElemNestingInfo;
  /** 将要推入到 putItemNestIdx 的第几个 */
  putIdx: number;
}

/**
 * 嵌套数组中的元素交换
 */
export const swapItemInNestArray = (nestArray, sourceIdx, targetIdx) => {
  // const sourceItemNestIdxStr = `[${sourceIdx.join("][")}]`;
  // const swapItemNestIdxStr = `[${targetIdx.join("][")}]`;
  // const swapSrcTempItem = at(nestArray, [sourceItemNestIdxStr]);
  // const swapTarTempItem = at(nestArray, [swapItemNestIdxStr]);
  const swapTarTempItem = getItemFromNestingItemsByBody(nestArray, targetIdx);
  const swapSrcTempItem = getItemFromNestingItemsByBody(nestArray, sourceIdx);

  setItem2NestingArr(nestArray, targetIdx, {
    addItem: swapSrcTempItem,
    spliceCount: 1,
  });

  setItem2NestingArr(nestArray, sourceIdx, {
    addItem: swapTarTempItem,
    spliceCount: 1,
  });

  return nestArray;
};

/**
 * 将元素推入嵌套数组中
 */
export const putItemInNestArray = (nestArray, sourceIdx, targetIdx, putIdx) => {
  // const sourceItemNestIdxStr = `[${sourceIdx.join("][")}]`;
  const swapSrcTempItem = getItemFromNestingItemsByBody(nestArray, sourceIdx);
  // at(nestArray, [sourceItemNestIdxStr]);

  setItem2NestingArr(nestArray, sourceIdx, {
    spliceCount: 1,
  });

  const srcPlaceIdx = [...targetIdx, putIdx];

  setItem2NestingArr(nestArray, srcPlaceIdx, {
    addItem: swapSrcTempItem,
    spliceCount: 0,
  });

  return srcPlaceIdx;
};

/**
 * 将元素推拉出嵌套数组
 */
export const pullItemInNestArray = (nestArray, sourceIdx, toIdx) => {
  // const sourceItemNestIdxStr = `[${sourceIdx.join("][")}]`;
  // const swapSrcTempItem = at(nestArray, [sourceItemNestIdxStr]);
  const swapSrcTempItem = getItemFromNestingItemsByBody(nestArray, sourceIdx);

  setItem2NestingArr(nestArray, sourceIdx, {
    spliceCount: 1,
  });

  setItem2NestingArr(nestArray, toIdx, {
    addItem: swapSrcTempItem,
    spliceCount: 0,
  });
};
