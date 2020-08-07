/**
 * 生产自增 ID 的工厂类
 */
const increaseIDFac = (idCount = 0) => (perfix = '') => {
  // eslint-disable-next-line no-param-reassign
  idCount += 1;
  return perfix ? [perfix, idCount].join('_') : String(idCount);
};
/**
 * 生产自增 ID 具体实现
 */
export const increaseID = increaseIDFac(0);

/**
 * 生产 ID
 */
export const wrapID = (...args) => {
  return args.join('_');
};
