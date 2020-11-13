/**
 * 是否为对象
 */
export const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
};

/**
 * @author 相杰
 * @important 基础算法，慎重修改
 *
 * 深 copy
 */
export const mergeDeep = <T>(target: T, ...sources): T => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};
