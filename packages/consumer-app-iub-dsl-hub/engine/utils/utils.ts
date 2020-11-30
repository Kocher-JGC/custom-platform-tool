export const noopError = (...args) => { console.error('空函数, 空调用~~!!', args); return false; };

export const sleep = (time = 1) => new Promise(
  (resolve) => setTimeout(() => resolve(), time * 1000)
);
