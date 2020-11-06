// eslint-disable-next-line @typescript-eslint/no-var-requires
import HOSTENV from '@/utils/env';
import { history } from 'umi';
import store from 'store';
import { initRequest } from './utils/request';

const getHostEnv = async (API) => {
  const envConfig = await fetch(`/config.json?${new Date().getTime()}`).then((res) => res.json());
  API = API || envConfig.API;
  envConfig.API = API;
  initRequest(API);
  store.set('API', API);
  HOSTENV.set(envConfig);
};
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export async function render(oldRender) {
  const { query } = history.location;
  console.log(query);
  Object.keys(query).forEach((q) => {
    store.set(q, query[q]);
  });
  await getHostEnv(query.API);
  oldRender();
}
