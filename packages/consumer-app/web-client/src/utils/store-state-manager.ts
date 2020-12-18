import storage from 'store';

export const getLessee = () => {
  return storage.get('app/lessee');
};
export const setLessee = (lessee:string) => {
  return storage.set('app/lessee', lessee);
};
export const removeLessee = () => {
  return storage.remove('app/lessee');
};
export const getCode = () => {
  return storage.get('app/code');
};
export const setCode = (code:string) => {
  return storage.set('app/code', code);
};
export const removeCode = () => {
  return storage.remove('app/code');
};
export const getAppName = () => {
  return storage.get('app/name');
};
export const removeAppName = () => {
  return storage.remove('app/name');
};
export const getToken = () => {
  return storage.get(`app/${getCode()}/token`)
}
export const setToken = (token:string) => {
  return storage.set(`app/${getCode()}/token`, token)
}
export const removeToken = () => {
  return storage.remove(`app/${getCode()}/token`)
}
export const getClientId = () => {
  return storage.get('client_id');
};
export const getClientSecret = () => {
  return storage.get('client_secret');
};
export const removeLoginData = () => {
  return storage.remove('prev/login/data');
};
export const removePaasToken = () => {
  return storage.remove('paas/token');
};
export const getIsRefresh = () => {
  return storage.get(`app/${getCode()}/isRefreshing`);
};
export const setIsRefresh = (isRefreshing:boolean) => {
  return storage.set(`app/${getCode()}/isRefreshing`, isRefreshing);
};
export const getRefreshTokenInfo = () => {
  return storage.get(`app/${getCode()}/refreshTokenInfo`);
};
interface RefreshTokenInfo {
  refresh_token:string,
  access_token:string, 
  expires_in:string,
  refreshTime:number,
}
export const setRefreshTokenInfo = (refreshTokenInfo:RefreshTokenInfo) => {
  return storage.set(`app/${getCode()}/refreshTokenInfo`,refreshTokenInfo);
};