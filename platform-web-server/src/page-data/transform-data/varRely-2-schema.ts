const demo = {
  wnlmddk6: {
    type: 'structObject', // structArray
    interRef: "@(interMeta).1330690108524994560",
    desc: '上级信息',
    struct: {
      wnlmddk6_id1: {
        type: 'string',
        fieldRef: "@(interMeta).1330690108524994560/1330690108566937616",
        desc: '主键',
      },
    }
  },
};

export const varRely2Schema = (varRely) => {
  // const keys = Object.keys(varRely);
  const res = {};
  for (const key in varRely) {
    const rely = varRely[key];
    /** 删除var.引用 */
    const actualKey = key.replace(/^var\./, '');
    if (Array.isArray(rely?.varAttr) &&  rely.varAttr.length) {
      res[actualKey] = {
        type: 'structObject',
        // type: 'string',
        desc: rely.title,
        schemaType: rely.type,
        schemaRef: actualKey,
        widgetRef: rely.widgetRef,
        // defaultVal: rely.realVal,
        code: rely.code,
        struct: rely.varAttr.reduce((res, obj) => {
          return {
            ...res,
            [obj?.attr]: {
              schemaRef: obj.attr,
              type: obj.type,
              desc: obj.alias,
              code: obj.attr,
              defaultVal: rely.realVal,
              fieldRef: '',
            }
          };
        }, {})
      };
    } else {
      res[actualKey] = {
        type: 'string',
        desc: rely.title,
        schemaRef: actualKey,
        schemaType: rely.type,
        widgetRef: rely.widgetRef,
        defaultVal: rely.realVal,
        code: rely.code,
        fieldRef: '',
      };
    }
  }
  return res;
};
