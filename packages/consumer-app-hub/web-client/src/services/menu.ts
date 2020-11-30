import store from 'store';

import { originGenUrl, SYS_MENU_BUSINESSCODE } from "../utils/gen-url";
import { getPageQuery } from '../utils/utils';
// import { menuMockData } from './menu.mock';

/**
 * 获取用户菜单
 * @param params
 */
export async function queryMenuList(params?: API.IMeunParams) {
  const { 
    lesseeCode = store.get("app/lessee"), 
    appCode = store.get("app/code") 
  } = getPageQuery();
  // return menuMockData;
  const res = await $A_R(originGenUrl({
    lesseeCode,
    appCode,
    bizCode: SYS_MENU_BUSINESSCODE
  }), {
    method: 'POST',
    data: {
      steps: [
        {
          function: {
            code: "ALL_ACTIVE_MENU",
            params: {
            }
          }
        }
      ]
    },
  });

  return res.data;
}
