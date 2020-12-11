import dayjs from "dayjs";
import { IHyMethod } from "./interface";

export const HY_METHODS: IHyMethod[] = [
  {
    type: "STRING",
    namespace: "HY",
    name: "LENGTH",
    describe: "返回指定字符串的字符长度",
    usage: "LENGTH(字符串)",
    example: 'LENGTH("javascript")',
    execute: (str: string) => {
      return str?.toString().length;
    }
  },
  {
    type: "STRING",
    namespace: "HY",
    name: "CONCAT",
    describe: "连接两个或多个字符串，参数表示连接的字符串",
    usage: "",
    example: "",
    execute: (...args: string[]) => args.reduce((a, b) => (a += b.toString()), "")
  },
  {
    type: "STRING",
    namespace: "HY",
    name: "INDEX_OF",
    describe:
      "某个指定字符串在该字符串中首次出现的位置，值可为0~字符串长度-1，searchValue 表示查找的指定字符串",
    usage: "",
    example: "",
    execute: (str: string, target_str: string) => str.indexOf(target_str)
  },
  {
    type: "DATE",
    namespace: "HY",
    name: "NOW",
    describe: "返回计算机系统当前设定的日期和时间值",
    usage: "NOW()",
    example: "",
    execute: () => dayjs().format("YYYY-MM-DD HH:mm:ss")
  },
  {
    type: "DATE",
    namespace: "HY",
    name: "FORMAT",
    describe: "按格式化要求返回日期对象格式化字符串",
    usage: 'FORMAT("yyyy-MM-dd")',
    example: "",
    execute: (date: Date | string, format: string) => dayjs(date).format(format)
  },
  {
    type: "MATH",
    namespace: "HY",
    name: "MAX",
    describe: "获取一组数字中的最大值",
    usage: "MAX([value1[,value2, ...]]) ",
    example: "MAX[1,2,3]",
    execute: (...args: number[]) => Math.max(...args)
  },
  {
    type: "MATH",
    namespace: "HY",
    name: "MIN",
    describe: "获取一组数字中的最小值",
    usage: "MIN([value1[,value2, ...]]) ",
    example: "MIN[1,2,3]",
    execute: (...args: number[]) => Math.max(...args)
  },
  {
    type: "ASYNC",
    namespace: "HY",
    name: "GET_ONE",
    describe: "",
    usage: "",
    example: "",
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
    describe: "",
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
