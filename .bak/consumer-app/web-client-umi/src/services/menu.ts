import { originGenUrl, SYS_MENU_BUSINESSCODE } from "@/utils/gen-url";
import { getPageQuery } from '@/utils/utils';
import store from 'store';
/**
 * 获取用户菜单
 * @param params
 */
export async function queryMenuList(params: API.IMeunParams) {
  let { lessee, app } = getPageQuery();
  if (!lessee) lessee = store.get("app/lessee");
  if (!app) app = store.get("app/code");
  return $A_R(originGenUrl(lessee, app, SYS_MENU_BUSINESSCODE), {
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
}
