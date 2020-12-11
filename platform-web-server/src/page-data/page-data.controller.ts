import { Controller, Get, Param, Post, Query, UseGuards , Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResHelperService } from 'src/res-helper/res-helper.service';
import { Roles } from 'src/roles/roles.decorator';
import { PageDataService } from './page-data.service';

@Controller('page-data')
// @UseGuards(RolesGuard)
export class PageDataController {
  constructor(
    private readonly pageDataService: PageDataService,
    private readonly resHelperService: ResHelperService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
  }

  validGetPageParam(queryString) {
    const { id, mode, lessee, app, t } = queryString;
    const necessaryParams = { id, lessee, app, t };
    for (const key in necessaryParams) {
      if (Object.prototype.hasOwnProperty.call(necessaryParams, key)) {
        const item = necessaryParams[key];
        if(!item) return {
          isPass: false,
          msg: `需要参数 ${key}`
        };
      }
    }
    return {
      isPass: true,
      msg: ``
    };
  }

  async getPageData(options) {
    try {
      const pageData = await this.pageDataService.getPageDataFromRemote(options);
      return {
        data: pageData
      };
    } catch(e) {
      return {
        err: e
      };
    }
  }

  @Get(`:lessee/:app/page/:id`)
  @Roles('admin')
  async getPageRest(@Param() params, @Query() queryString) {
    const { id, lessee, app } = params;
    const { mode } = queryString;
    const { err, data } = await this.getPageData({ id, lessee, app });
    const resData = this.resHelperService.wrapResStruct({ 
      data,
      code: err ? this.resHelperService.BusinessCodes.Error : this.resHelperService.BusinessCodes.Success,
      msg: err || undefined
    });
    return resData;
  }

  @Get()
  async getPage(@Query() queryString) {
    this.logger.info(`请求获取页面数据`);

    const { isPass, msg } = this.validGetPageParam(queryString);
    if(!isPass) {
      this.logger.error(`页面参数验证不通过`);
      return msg;
    }
    const { id, mode, lessee, app, t } = queryString;
    try {
      const pageData = await this.pageDataService.getPageDataFromRemote({ lessee, app, id, token: t });
      const resData = this.resHelperService.wrapResStruct({ data: pageData });
      return resData;
    } catch(e) {
      console.log(e);
      return {
        err: JSON.stringify(e.message),
        code: '10000'
      };
    }
    // console.log(pageData);
  }
}
// if(!request.headers) return { code: '500', msg: '未授权' };