import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { omit } from 'lodash';
import { PreviewAppService } from 'src/preview-app/preview-app.service';
import config from '../../config';
import { genUrl } from './utils';
import { pageData2IUBDSL } from './transform-data';

const { mockToken } = config;

@Injectable()
export class PageDataService {

  constructor(
    private readonly previewAppService: PreviewAppService
  ) {}

  /**
   * 从远端获取页面数据
   */
  async getPageDataFromRemote({
    lessee,
    app,
    token = mockToken,
    id
  }): Promise<any> {
    console.log('token', token);
    // const token = this.previewAppService.getToken(lessee);
    const reqUrl = `${genUrl({ lessee, app })}/page/v1/pages/${id}`;
    console.log('reqUrl', reqUrl);
    const processCtx = {
      token, lessee, app
    };
    try {
      const resData = await axios
        .get(reqUrl, {
          headers: {
            Authorization: token
          }
        });
      const data = resData?.data?.result;
      if(!data) {
        console.error('页面输出存在问题?', data);
        throw Error(resData?.data?.msg);
      } else {
        console.log('resDataMsg', resData?.data);
        return await pageData2IUBDSL(data, processCtx);
      }
    } catch(e) {
      console.error('error', e);
      throw Error(e);
      // return e;
    }
  }
}
// `http://192.168.14.140:6090/paas/hy/app/page/v1/pages/1308242886768336896`
