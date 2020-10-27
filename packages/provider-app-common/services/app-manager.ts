/**
 * 应用管理 API
 */

/**
 * 获取应用
 */
export async function GetApplication() {
  return await $R_P.get('/manage/v1/applications');
}

/**
 * 创建应用
 */
export async function CreateApplication(data) {
  return await $R_P.post('/manage/v1/applications', data);
}
