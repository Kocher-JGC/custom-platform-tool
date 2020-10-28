/**
 * 应用管理 API
 */

/**
 * 获取应用
 */
export async function GetApplication() {
  return await $R_P.get({
    url: '/manage/v1/applications',
    // options: {
    //   businessTip: {
    //     type: 'success',
    //     whenCodeEq: '00000'
    //   }
    // }
  });
}

/**
 * 创建应用
 */
export async function CreateApplication(data) {
  // return await $R_P.post('/manage/v1/applications', data, {
  //   businessTip: {
  //     type: 'error',
  //   }
  // });
  return await $R_P.post({
    url: '/manage/v1/applications',
    data,
    options: {
      businessTip: {
        type: 'success',
        whenCodeEq: '00000'
      }
    }
  });
}

/**
 * 删除应用
 */
export async function DelApplication(appID) {
  return await $R_P.del(`/manage/v1/applications/${appID}`);
}
