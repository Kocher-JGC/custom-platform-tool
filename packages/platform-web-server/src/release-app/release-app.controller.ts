/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import { Controller, Get, Param, Query, Req, Res, Inject, Logger } from "@nestjs/common";
import { pageData2IUBDSL } from "src/page-data/transform-data";
import { getRTablesMeta } from "@src/page-data/remote";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PageDataService } from "../page-data/page-data.service";
import { ReleaseAppService } from "./release-app.service";
import config from "../../config";

const { mockToken } = config;
@Controller("release-app")
export class ReleaseAppController {
  constructor(
    private readonly pageDataService: PageDataService,
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
    const { headers } = req;
    const {
      getPageDataFromProvider,
      generatePageDataFolder,
      generateAppConfig,
      generatePageDataJSONZip
    } = this.releaseAppService;
    if (applicationCode) {
      let link = "";
      const folderName = "data";
      const zipName = `${releaseId}.zip`;
      try {
        const pageDataRes = await getPageDataFromProvider(
          { lesseeCode, applicationCode },
          headers.authorization
        );
        if (Array.isArray(pageDataRes) && pageDataRes.length > 0) {
          await generatePageDataFolder(folderName, releaseId);
          await generateAppConfig(folderName, { lesseeCode, applicationCode }, releaseId);
          const processCtx = {
            token: mockToken,
            lessee: lesseeCode,
            app: applicationCode
          };
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
          const result = await Promise.all(genPageFilesPromise);
          this.printGenFileRes(result, pageDataRes); // 打印结果
          link = await generatePageDataJSONZip(folderName, zipName, releaseId);
          return res.download(link);
        }
        // throw new Error(pageDataRes.msg || "没有页面可以发布");
        return res.status(404).json({ msg:  `${applicationCode} 没有页面可以发布` });
      } catch (error) {
        return res.status(500).json({ msg: `${applicationCode} ${error.message}` });
      }
    } else {
      return res.status(400).json({ msg: "需要参数 app" });
    }
  }

  printGenFileRes(genResult: boolean[], pageData: any[]) {
    const res = pageData.map(({ id }, index) => ({ [id]: genResult[index] }));
    console.log(res);
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
