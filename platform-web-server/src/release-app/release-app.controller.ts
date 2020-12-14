import { Request, Response } from "express";
import { Controller, Get, Param, Query, Req, Res, Inject } from "@nestjs/common";
import { pageData2IUBDSL } from "src/page-data/transform-data";
import { getRTablesMeta } from "@src/page-data/remote";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from 'winston';
// import { PageDataService } from "../page-data/page-data.service";
import { ReleaseAppService } from "./release-app.service";
import config from "../../config";

const { mockToken } = config;
@Controller("release-app")
export class ReleaseAppController {
  constructor(
    // private readonly pageDataService: PageDataService,
    private readonly releaseAppService: ReleaseAppService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  /**
   *
   * 生成指定应用的配置页面数据压缩包
   * 1. 判断请求参数
   * 2. 根据应用获取发布页面列表
   * 3. 生成放置 json 临时文件夹，生成页面配置信息 json 文件
   * 4. 循环生成 iub-dsl 数据结构并保存到文件
   * 5. 生成 json 文件压缩包
   * 6. 删除 json 临时文件夹
   * @param {{ applicationCode: string }} { applicationCode }
   * @returns 生成结果
   * @memberof ReleaseAppController
   */
  @Get("/:lesseeCode/:applicationCode")
  async releaseApp(
  @Req() req: Request,
    @Res() res: Response,
    @Param() { lesseeCode, applicationCode },
    @Query() { releaseId }
  ) {
    this.logger.info(`导出应用 lesseeCode: ${lesseeCode} applicationCode: ${applicationCode}`);
    const { headers } = req;
    const {
      getPageDataFromProvider,
      generatePageDataFolder,
      generateAppConfig,
      generatePageDataJSONZip
    } = this.releaseAppService;
    const msgPrefix = `应用编码: ${applicationCode} releaseId: 1${releaseId}`;
    if (applicationCode) {
      let link = "";
      const folderName = "data";
      const zipName = `${releaseId}.zip`;
      try {
        const pageDataRes = await getPageDataFromProvider(
          { lesseeCode, applicationCode },
          headers.authorization
        );
        this.logger.info(`${msgPrefix} 获取发布页面数据成功`);
        if (Array.isArray(pageDataRes) && pageDataRes.length > 0) {
          await generatePageDataFolder(folderName, releaseId);
          this.logger.info(`${msgPrefix} 生成页面 json 存放文件夹`);
          await generateAppConfig(folderName, { lesseeCode, applicationCode }, releaseId);
          this.logger.info(`${msgPrefix} 生成应用配置信息`);
          const processCtx = {
            token: mockToken,
            lessee: lesseeCode,
            app: applicationCode
          };
          this.logger.info(`${msgPrefix} 开始生成页面文件`);
          /** 转换IUBDSL需要的上下文 */
          const transfCtx = {
            getRemoteTableMeta: async (tableIds: string[]) => {
              return await getRTablesMeta(tableIds as any, processCtx);
            },
            logger: this.logger
          };
          const genPageFilesPromise = pageDataRes.map((pageData) =>
            this.genFileFromPageData(pageData, transfCtx, {
              folderName,
              releaseId,
            })
          );
          this.logger.info(`${msgPrefix} 转换页面数据完成`);
          const result = await Promise.all(genPageFilesPromise);
          this.printGenFileRes(result, pageDataRes, this.logger, msgPrefix); // 打印结果
          this.logger.info(`${msgPrefix} 开始生成压缩包`);
          link = await generatePageDataJSONZip(folderName, zipName, releaseId);
          this.logger.info(`${msgPrefix} 完成生成压缩包`);
          return res.download(link);
        }
        this.logger.error(`${msgPrefix} 导出失败，没有页面可以发布`);
        return res.status(404).json({ msg:  `${msgPrefix} 没有页面可以发布` });
      } catch (error) {
        this.logger.error(`${msgPrefix} 导出失败`, error);
        return res.status(500).json({ msg: `${msgPrefix} ${error.message}` });
      }
    } else {
      return res.status(400).json({ msg: `${msgPrefix} 需要参数 app` });
    }
  }

  printGenFileRes(genResult: boolean[], pageData: any[], logger: Logger, msgPrefix: string) {
    const res = pageData.map(({ id }, index) => ({ [id]: genResult[index] }));
    logger.info(`${msgPrefix} 生成页面 json 文件结果`, res);
  }

  async genFileFromPageData(pageData, transfCtx , { folderName, releaseId }) {
    const { generatePageDataJSONFile } = this.releaseAppService;
    const { id } = pageData;
    let dsl;
    try {
      dsl =  await pageData2IUBDSL(pageData, transfCtx);
    } catch(e) {
      console.error(e);
    }
    const createJSONFileRes = await generatePageDataJSONFile(
      folderName,
      releaseId,
      id,
      JSON.stringify(dsl)
    );
    return createJSONFileRes;
  }
}
