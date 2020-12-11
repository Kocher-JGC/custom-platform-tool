import * as config from '../../../env.json';

export const genUrl = (params: {lessee: string, app: string }) => {
  return `${config.paasServerUrl}/${params.lessee}/${params.app}`;
};

export const pickObjFromKeyArr = (obj, keyArr: string[]) => {
  return keyArr.reduce((res, key) => {
    res[key] = obj[key];
    return res;
  }, {});
};
