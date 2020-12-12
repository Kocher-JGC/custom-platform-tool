import dayjs from "dayjs";
import { IHyMethod } from "./interface";

export const HY_METHODS: IHyMethod[] = [
  {
    type: "STRING",
    namespace: "HY",
    name: "LENGTH",
    describe: "返回指定字符串的字符长度",
    usage: "HY.LENGTH(字符串)",
    example: 'HY.LENGTH("javascript")',
    execute: (str: string) => {
      return str?.toString().length;
    }
  },
  {
    type: "STRING",
    namespace: "HY",
    name: "CONCAT",
    describe: "连接两个或多个字符串，参数表示连接的字符串",
    usage: "HY.CONCAT(字符串1,字符串2,...)",
    example: 'HY.CONCAT("a1","a2","a3")',
    execute: (...args: string[]) => args.reduce((a, b) => (a += b.toString()), "")
  },
  {
    type: "STRING",
    namespace: "HY",
    name: "INDEX_OF",
    describe: "可返回某个指定的字符串值在字符串中首次出现的位置",
    usage: "HY.INDEX_OF(字符串，指定字符串)",
    example: 'HY.INDEX_OF("hello world","world")',
    execute: (str: string, targetStr: string) => str.indexOf(targetStr)
  },
  {
    type: "DATE",
    namespace: "HY",
    name: "NOW",
    describe: "返回计算机系统当前设定的日期和时间值",
    usage: "HY.NOW()",
    example: "HY.NOW()",
    execute: () => dayjs().format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "DATE",
    namespace: "HY",
    name: "FORMAT",
    describe: "按格式化要求返回日期对象格式化字符串",
    usage: 'HY.FORMAT(日期或者日期字符串，格式)',
    example: 'HY.FORMAT(new Date() | "2020-12-12","yyyy-MM-dd")',
    execute: (date: Date | string, format: string) => dayjs(date).format(format)
  },
  {
    type: "MATH",
    namespace: "HY",
    name: "MAX",
    describe: "获取一组数字中的最大值",
    usage: "HY.MAX([value1[,value2, ...]]) ",
    example: "HY.MAX[1,2,3]",
    execute: (...args: number[]) => Math.max(...args)
  },
  {
    type: "MATH",
    namespace: "HY",
    name: "MIN",
    describe: "获取一组数字中的最小值",
    usage: "HY.MIN([value1[,value2, ...]]) ",
    example: "HY.MIN[1,2,3]",
    execute: (...args: number[]) => Math.min(...args)
  },
  {
    type: "ASYNC",
    namespace: "HY",
    name: "GET_ONE",
    describe: "模拟异步获取，目前函数传入一个参数，作为 { name: 参数 } 返回",
    usage: "",
    example: '(await HY.GET_ONE("test")).name 返回 test',
    execute: async (name: string) =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve({ name });
        }, 1000)
      )
  },
  {
    type: "ASYNC",
    namespace: "HY",
    name: "UUID",
    describe: "模拟异步获取，目前固定返回 uuid-1",
    usage: "",
    example: "",
    execute: async () =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve("uuid-1");
        }, 1000)
      )
  }
];
