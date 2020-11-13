import { history } from 'umi';
import store from 'store';
import { initRequest } from './utils/request';
import { usedConfKey, UsedConfKey } from './utils/env';

const firstUpperCase = (str: string) => str.replace(/^\S/, (s) => s.toUpperCase());

/**
 * 根据模式和envConf生成conf
 */
const genHostEnvConf = async () => {
  const envConf = await fetch(`/config.json?${new Date().getTime()}`).then((res) => res.json());
  const mode = store.get('mode');
  const modeKey = mode === 'preview' ? 'preview' : 'prod';

  return usedConfKey.reduce((res, key) => {
    if (key === UsedConfKey.passServerUrl) {
      res[key] = envConf[key];
    } else {
      res[key] = envConf[modeKey + firstUpperCase(key)];
    }
    return res;
  }, {});
};

/**
 * 当query没有对应配置获取配置文件的配置并写入
 */
const setHostEnv = async () => {
  const conf = await genHostEnvConf();
  usedConfKey.forEach((key) => {
    const val = store.get(key);
    /** store没有该配置设置对应配置 */
    if (!val) {
      store.set(key, conf[key]);
    }
  });

  const sassServerUrl = store.get(UsedConfKey.sassServerUrl);
  initRequest(sassServerUrl);
};

/**
 * 储存所有url的query的数据
 */
const saveQueryParam = () => {
  const { query } = history.location;
  console.log(query);
  Object.keys(query).forEach((q) => {
    if (q === 't') {
      store.set('token', query[q]);
    }
    store.set(q, query[q]);
  });
};

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export async function render(oldRender) {
  saveQueryParam();
  await setHostEnv();
  oldRender();
}
