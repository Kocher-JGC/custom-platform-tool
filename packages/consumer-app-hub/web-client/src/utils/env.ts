/** url配置的key */
export enum UrlConfKey {
  /** 预览时候sass服务的url */
  saasServerUrl = "saasServerUrl",
  /** 预览时候页面服务的url */
  pageServerUrlForApp = "pageServerUrlForApp"
}

/**
 * 获取/public/conf.json配置
 */
export const getAppEnvConfig = async () => {
  const envConf = await fetch(`/config.json?${new Date().getTime()}`).then((res) => res.json());
  return envConf;
};

export enum MainConfKey {
  applicationCode = "applicationCode",
  lesseeCode = "lesseeCode"
}

/**
 * 获取应用安装时候main.json配置信息
 */
export async function getMainConf(currentApp: string) {
  const mainConf = await fetch(`${currentApp}/main.json?t=${new Date().getTime()}`).then((res) =>
    res.json()
  );
  return {
    app: mainConf.applicationCode,
    lessee: mainConf.lesseeCode
  };
}

/**
 * 获取已安装应用信息
 */
export async function getAppList() {
  const appList = await fetch(`http://localhost:5020/app-list?t=${new Date().getTime()}`).then((res) => res.json());
  return Object.values(appList);
}

/** 所有配置的key */
export const usedConfKeys = [...Object.keys(UrlConfKey), ...Object.keys(MainConfKey)];
