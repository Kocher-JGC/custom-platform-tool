/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import { Controller, Get, Param, Query, Req, Res } from "@nestjs/common";
import { PageDataService } from "../page-data/page-data.service";
import { ReleaseAppService } from "./release-app.service";

@Controller("release-app")
export class ReleaseAppController {
  constructor(
    private readonly pageDataService: PageDataService,
    private readonly releaseAppService: ReleaseAppService
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
      generatePageDataJSONFile,
      generatePageDataJSONZip
    } = this.releaseAppService;
    if (applicationCode) {
      let link = "";
      const folderName = `${applicationCode}_${releaseId}`;
      const zipName = `${applicationCode}_${releaseId}.zip`;
      try {
        const pageDataRes = await getPageDataFromProvider(
          { lesseeCode, applicationCode },
          headers.authorization
        );
        if (Array.isArray(pageDataRes) && pageDataRes.length > 0) {
          await generatePageDataFolder(folderName);
          await generateAppConfig(folderName, { lesseeCode, applicationCode });
          // TODO 循环生成实现方式
          const createAllJSONFileRes = pageDataRes.map(async (item) => {
            const { id, pageContent, dataSources } = item;
            // let tableMetaData;
            // if (Array.isArray(dataSources) && dataSources.length > 0) {
            //   tableMetaData = await this.pageDataService.getTableMetadata(dataSources, {
            //     t: ""
            //   });
            // }
            // const dsl = this.pageDataService.pageData2IUBDSL(item, { tableMetaData });
            const dsl = JSON.parse(pageContent);
            const createJSONFileRes = await generatePageDataJSONFile(
              folderName,
              id,
              JSON.stringify(dsl)
            );
            return { [id]: createJSONFileRes };
          });
          for (const resPromise of createAllJSONFileRes) {
            // eslint-disable-next-line no-await-in-loop
            console.log(await resPromise);
          }
          link = await generatePageDataJSONZip(folderName, zipName);
          return res.download(link);
        }
        // throw new Error(pageDataRes.msg || "没有页面可以发布");
        return res.status(404).json({ msg: "没有页面可以发布" });
      } catch (error) {
        return res.status(500).json({ msg: error.message });
      }
    } else {
      return res.status(400).json({ msg: "需要参数 app" });
    }
  }
}
