import { getEnvConfig } from "../../utils";
// import * as config from '../../../env.json';

export const genUrl = async (params: {lessee: string, app: string }) => {
  const envConfig = await getEnvConfig();
  return `${envConfig.paasServerUrl}/${params.lessee}/${params.app}`;
};

export const pickObjFromKeyArr = (obj, keyArr: string[]) => {
  return keyArr.reduce((res, key) => {
    res[key] = obj[key];
    return res;
  }, {});
};
