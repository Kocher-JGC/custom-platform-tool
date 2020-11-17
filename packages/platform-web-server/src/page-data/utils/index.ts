import config from '../../../config';

const platformApiUrl = "http://192.168.14.181:6090/paas";

export const genUrl = (params: {lessee: string, app: string }) => {
  return `${platformApiUrl}/${params.lessee}/${params.app}`;
};

export const pickObjFromKeyArr = (obj, keyArr: string[]) => {
  return keyArr.reduce((res, key) => {
    res[key] = obj[key];
    return res;
  }, {});
};
