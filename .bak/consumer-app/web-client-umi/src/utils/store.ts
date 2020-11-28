import store from 'store';

export const getLessee = () => {
  return store.get('app/lessee')
}

export const getApp = () => {
  return store.get('app/code')
}