/** 查询表详情 */
export async function getShowAuthorities(params) {
  return await $R_P.get({
    url: `/auth/v1/showAuthorities/list/`,
    params,
  });
}
/**
 * 获取左侧菜单
 * @param params 条件
 */
export async function getShowAuthoritiesTree(params) {
  return await $R_P.get({
    url: `/auth/v1/showAuthorities/getAuthorityInTree`,
    params
  });
}
