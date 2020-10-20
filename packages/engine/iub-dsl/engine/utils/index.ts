export * from './compose';
export * from './use-cache-state';
export * from './use-async-memo';
export * from './assert';
export const sleep = (time = 1) => new Promise(
  (resolve) => setTimeout(() => resolve(), time * 1000)
);
