import dayjs from "dayjs";
import { IExpressionFunction, IHyMethod } from "./interface";

export const SHOW_FUNCTION_FIELD = {
  describe: "",
  usage: "用法",
  example: "示例"
};

export enum HY_METHODS_TYPE {
  STRING = "字符串",
  DATE = "时间",
  ASYNC = "数学",
  MATH = "数据库"
}

export enum VAR_VALUE_TYPE {
  number = "数字",
  string = "字符串",
  date = "日期",
  dateTime = "日期时间"
}

export enum VARIABLE_TYPE {
  customed = "自定义变量",
  page = "页面变量",
  system = "系统变量",
  widget = "控件变量",
  pageInput = "输入参数变量"
}

export const HY_METHODS: IHyMethod[] = [
  {
    type: "STRING",
    namespace: "HY",
    name: "LENGTH",
    describe: "返回指定字符串的字符长度",
    usage: "LENGTH(字符串)",
    example: 'LENGTH("javascript")',
    execute: (str: string) => str.length
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
    execute: async () =>
      new Promise((resolve) =>
        setTimeout(() => {
          resolve({ success: true });
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
          resolve({ id: "test" });
        }, 1000)
      )
  }
];

export const EXPRESSION_FUNCTION: IExpressionFunction[] = [
  {
    title: "字符串函数",
    name: "STRING",
    namespace: "HY",
    options: [
      {
        title: "LENGTH",
        name: "LENGTH",
        describe: "返回指定字符串的字符长度",
        usage: "LENGTH(字符串)",
        example: 'LENGTH("abcdef")'
      },
      {
        title: "CHAR_AT",
        name: "CHAR_AT",
        describe: "返回在指定位置的字符，index 参数表示字符的位置，从0开始",
        usage: "",
        example: ""
      },
      {
        title: "CHAR_CODE_AT",
        name: "CHAR_CODE_AT",
        describe: "返回在指定位置字符的 Unicode 编码，index 参数表示字符的位置，从0开始",
        usage: "",
        example: ""
      },
      {
        title: "CONCAT",
        name: "CONCAT",
        describe: "连接两个或多个字符串，参数表示连接的字符串",
        usage: "",
        example: ""
      },
      {
        title: "INDEX_OF",
        name: "INDEX_OF",
        describe:
          "某个指定字符串在该字符串中首次出现的位置，值可为0~字符串长度-1，searchValue 表示查找的指定字符串",
        usage: "",
        example: ""
      },
      {
        title: "LAST_INDEX_OF",
        name: "LAST_INDEX_OF",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "REPLACE",
        name: "REPLACE",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SLICE",
        name: "SLICE",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SPLIT",
        name: "SPLIT",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SUBSTR",
        name: "SUBSTR",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SUBSTRING",
        name: "SUBSTRING",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_LOWER_CASE",
        name: "TO_LOWER_CASE",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_UPPER_CASE",
        name: "TO_UPPER_CASE",
        describe: "",
        usage: "",
        example: ""
      },
      { title: "TRIM", name: "TRIM", describe: "", usage: "", example: "" },
      {
        title: "TO_STRING",
        name: "TO_STRING",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "PARSE_INT",
        name: "PARSE_INT",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "PARSE_FLOAT",
        name: "PARSE_FLOAT",
        describe: "",
        usage: "",
        example: ""
      },
      { title: "LEFT", name: "LEFT", describe: "", usage: "", example: "" },
      {
        title: "RIGHT",
        name: "RIGHT",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "IS_EMPTY",
        name: "IS_EMPTY",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "COMPLETE",
        name: "COMPLETE",
        describe: "",
        usage: "",
        example: ""
      }
    ]
  },
  {
    title: "时间函数",
    name: "DATE",
    namespace: "HY",
    options: [
      {
        title: "NOW",
        name: "NOW",
        describe: "返回计算机系统当前设定的日期和时间值",
        usage: "NOW()",
        example: ""
      },
      { title: "DATE", name: "DATE", describe: "将字符串转为日期格式", usage: "", example: "" },
      {
        title: "FORMAT",
        name: "FORMAT",
        describe: "按格式化要求返回日期对象格式化字符串",
        usage: 'FORMAT("yyyy-MM-dd")',
        example: ""
      },
      {
        title: "GET_DATE",
        name: "GET_DATE",
        describe: "返回 Date 对象属于哪一天的值，可取值 1-31",
        usage: 'Date("2020-3-4 14:00:05")',
        example: ""
      },
      {
        title: "GET_FULL_YEAR",
        name: "GET_FULL_YEAR",
        describe: "获得日期对象的4位年份值",
        usage: "",
        example: ""
      },
      {
        title: "GET_HOURS",
        name: "GET_HOURS",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "GET_MONTH",
        name: "GET_MONTH",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "PARSE",
        name: "PARSE",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_DATE_STRING",
        name: "TO_DATE_STRING",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_JSON",
        name: "TO_JSON",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_LOCALE_DATE_STRING",
        name: "TO_LOCALE_DATE_STRING",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_LOCALE_TIME_STRING",
        name: "TO_LOCALE_TIME_STRING",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "TO_LOCALE_STRING",
        name: "TO_LOCALE_STRING",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "VALUE_OF",
        name: "VALUE_OF",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "ADD_DAYS",
        name: "ADD_DAYS",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "ADD_HOURS",
        name: "ADD_HOURS",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "ADD_MINUTES",
        name: "ADD_MINUTES",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SUBTRACT_DAYS",
        name: "SUBTRACT_DAYS",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SUBTRACT_HOURS",
        name: "SUBTRACT_HOURS",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "SUBTRACT_MINUTES",
        name: "SUBTRACT_MINUTES",
        describe: "",
        usage: "",
        example: ""
      }
    ]
  },
  {
    title: "数学函数",
    name: "MATH",
    namespace: "HY",
    options: [
      { title: "CEIL", name: "CEIL", describe: "", usage: "", example: "" },
      {
        title: "FLOOR",
        name: "FLOOR",
        describe: "",
        usage: "",
        example: ""
      },
      { title: "MAX", name: "MAX", describe: "", usage: "", example: "" },
      { title: "MIN", name: "MIN", describe: "", usage: "", example: "" },
      {
        title: "RANDOM",
        name: "RANDOM",
        describe: "",
        usage: "",
        example: ""
      },
      {
        title: "ROUND",
        name: "ROUND",
        describe: "",
        usage: "",
        example: ""
      }
    ]
  },
  {
    title: "数据库函数",
    name: "ASYNC",
    namespace: "HY",
    options: [
      {
        title: "GET_ONE",
        name: "GET_ONE",
        async: true,
        describe: "",
        usage: "",
        example: ""
      },
      { title: "UUID", name: "UUID", async: true, describe: "", usage: "", example: "" }
    ]
  }
];
