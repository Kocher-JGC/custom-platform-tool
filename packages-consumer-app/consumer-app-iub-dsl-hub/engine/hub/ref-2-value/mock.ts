import { ComplexType } from "@iub-dsl/definition";

/**
 * XX层级第N组下标标识(#(level|idx) , 写法: #(0|*) 意为: 第0层的所有下标
 * 1. a[#(0|*)]/b[#(1|*)], #(0|*), 会跟随上级的所有idx 
 * 2. a[#(0|0)]/b[#(1|*)], #(0|0), 仅使用第0层的idx = 0
 * 3. #(exp1|exp2), 层级/idx都可以是表达式计算的数字 「扩展、但挺难的」
 */

export const mockRefStruct = {
  id: {
    type: ComplexType.structArray,
    struct: [
      {
        key: 'code',
        val: '@(runCtx).payload/struct1[#(0|*)]/code'
      },
      {
        key: 'name',
        val: '@(runCtx).payload/struct1[#(0|*)]/name' // 这个idx是一定的
      },
      {
        key: 'obj',
        val: {
          type: ComplexType.structObject,
          struct: [
            {
              key: 'code1',
              val: '@(runCtx).payload/struct1[#(0|*)]/code'
            },
            {
              key: 'name1',
              val: '@(runCtx).payload/struct1[#(0|*)]/name' // 这个idx是一定的
            },
          ]
        }
      },
      {
        key: 'str',
        val: '@(runCtx).payload/struct2[#(0|*)]/str' // 这个idx是计算的
      },
      {
        key: 'child',
        val: {
          type: ComplexType.structArray,
          struct: [
            {
              key: 'a',
              val: '@(runCtx).payload/struct1[#(0|*)]/child[#(1|*)]/a',
            },
            {
              key: 'str',
              val: '@(runCtx).payload/struct2[#(1|*)]/str',
            },
            {
              key: 'sub',
              val: {
                type: ComplexType.structArray,
                struct: [
                  {
                    key: 'code',
                    val: '@(runCtx).payload/struct3[#(2|*)]/code'
                  },
                  {
                    key: 'name',
                    val: '@(runCtx).payload/struct3[#(2|*)]/name'
                  },
                ]
              }
            },
          ]
        }
      },
    ]
  }
};

const data1 = [
  {
    code: 1,
    name: '名字',
  },
  {
    code: 2,
    name: '大大'
  },
  {
    code: 3,
    name: '小小'
  }
];

export const mockData = {
  struct1: [
    {
      code: 'code1',
      name: 'name1',
      child: [
        {
          a: 'a1',
        },
        {
          a: 'b2',
        },
        {
          a: 'c1',
        }
      ]
    },
    {
      code: 'code2',
      name: 'name2',
      child: [
        {
          a: 'a2',
        },
        {
          a: 'b2',
        },
        {
          a: 'c2',
        }
      ]
    },
    {
      code: 'code3',
      name: 'name3',
      child: [
        {
          a: 'a3',
        },
        {
          a: 'b3',
        },
        {
          a: 'c3',
        }
      ]
    },
  ],
  struct2: [
    {
      str: 'str1'
    },
    {
      str: 'str2'
    },
    {
      str: 'str3'
    },
  ],
  struct3: data1
};