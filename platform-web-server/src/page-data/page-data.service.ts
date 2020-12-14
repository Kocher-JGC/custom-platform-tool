import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import axios from 'axios';
import { omit } from 'lodash';
import { PreviewAppService } from 'src/preview-app/preview-app.service';
import config from '../../config';
import { genUrl } from './utils';
import { pageData2IUBDSL } from './transform-data';
import { getRTablesMeta } from "./remote/get-remote";

const { mockToken } = config;

@Injectable()
export class PageDataService {
  constructor(
    private readonly previewAppService: PreviewAppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
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
    const url = await genUrl({ lessee, app });
    const reqUrl = `${url}/page/v1/pages/${id}`;

    this.logger.info(`准备发起请求`);
    this.logger.info(`token: ${token}`);
    this.logger.info(`reqUrl: ${reqUrl}`);

    const processCtx = {
      token, lessee, app
    };
    const resData = await axios
      .get(reqUrl, {
        headers: {
          Authorization: token
        }
      });
    const data = resData?.data?.result;
    if(!data) {
      this.logger.error(`没有页面数据: ${data}`);
      throw Error('没有页面数据');
    }
    this.logger.info(`请求页面数据成功`);

    const transfCtx = {
      getRemoteTableMeta: async (tableIds: string[]) => {
        return await getRTablesMeta(tableIds, processCtx);
      },
      logger: this.logger
    };

    return await pageData2IUBDSL(data, transfCtx);
  }
}
