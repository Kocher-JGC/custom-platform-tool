import { set as LSet, flow } from 'lodash';
import { PATH_SPLIT_MARK, pickPageStateKeyWord } from "./const";

const pathMarkRegExp = new RegExp(PATH_SPLIT_MARK, 'g');
/**
 * 将schema等级分割的标示转换成lodashSet等级分割的标示
 * @param s 需要替换的字符串
 */
const pathMarkRep = (s: string) => s.replace(pathMarkRegExp, '.');

const arrMarkRegExp = /\[([^\]]*)\]/g;
// const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\/\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\/|\[\])(?:\/|\[\]|$))/g;

// const rrMarkRegExp = new RegExp(`(\\[([^\\]]*)\\]|${'/'})|[^\\[|${'/'}]+(?=\\[([^\\]]*)\\]|${'/'})` ,'g');

/**
 * 将匹配数组标示的path, 防止设置的时候出错
 * @param s 需要替换的字符串
 */
const arrMarkRep = (s: string) => {
  /** test: 1327[fsda]/57[1]/5952[]/40596[3df21]/2759 */
  return s.replace(
    arrMarkRegExp,
    (match: string, subMatch: string, matchIdx: number, orgigin: number) => {
      const num = Number(subMatch);
      if (!isNaN(num)) {
        return `[${num}]`;
      }
      console.warn(`匹配出错-匹配:${match},源:${orgigin}`);
      return `[0]`;
    }
  );
};

/** 将schema的标示转化成lodashSetPath的标示 */
const schemaMarkToLSetPath = flow([pickPageStateKeyWord, pathMarkRep, arrMarkRep]);

/**
 * 使用schemaPath描述规则设置对象值
 * @param data 数据对象
 * @param path 设置路径
 * @param value 设置值
 */
export const setOfSchemaPath = (data: any, path: string, value: any) => {
  path = schemaMarkToLSetPath(path);
  return LSet(data, path, value);
};
