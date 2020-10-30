interface UpdatePageParams {
  /** 给后端的页面数据 */
  pageInfoForBN
  /** 前端维护的页面内容 */
  pageContentForFE
  extendData
}

/**
 * 更新页面
 */
export async function updatePageService({
  pageInfoForBN,
  pageContentForFE,
  extendData
}: UpdatePageParams) {
  if (!pageInfoForBN) {
    return console.error('请传入 pageInfoForBN');
  }
  const updatePageData = Object.assign({}, pageInfoForBN, extendData, {
    pageContent: JSON.stringify(pageContentForFE),
  });
  console.log('pageContentForFE', pageContentForFE);
  return await $R_P.put({
    url: `/page/v1/pages/${pageInfoForBN.id}`,
    data: updatePageData,
    options: {
      businessTip: {
        whenCodeEq: '00000',
        type: 'success'
      }
    }
  });
}

/**
 * 获取页面详情
 */
export async function getPageDetailService(pageID: string) {
  const pageData = await $R_P.get(`/page/v1/pages/${pageID}`);
  // 为了兼容未来的字段更改
  const { result } = pageData;
  if (!result) return {};
  let pageContent;
  try {
    pageContent = JSON.parse(result.pageContent);
  } catch (e) {
    console.log('暂无数据');
  }
  result.pageContent = pageContent;
  return result;
}

export async function getDataSourceDetail(tableID) {
  const resData = await $R_P.get({
    url: `/data/v1/tables/${tableID}`,
  });

  return resData?.result;
}
