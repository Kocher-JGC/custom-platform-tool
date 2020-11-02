/* eslint-disable @typescript-eslint/no-var-requires */
import { Response } from "express";
import { Controller, Get, Param, Res } from "@nestjs/common";
import { PageDataService } from "../page-data/page-data.service";
import { ResHelperService } from "../res-helper/res-helper.service";
import { ReleaseAppService } from "./release-app.service";

@Controller("release-app")
export class ReleaseAppController {
  constructor(
    private readonly pageDataService: PageDataService,
    private readonly releaseAppService: ReleaseAppService,
    private readonly resHelperService: ResHelperService
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
  @Res() res: Response,
    @Param() { lesseeCode, applicationCode }: { lesseeCode: string; applicationCode: string }
  ) {
    const curTime = new Date().getTime();
    const resData = {
      data: null,
      code: this.resHelperService.BusinessCodes.Error,
      msg: `应用${applicationCode}`
    };
    const {
      getPageDataFromProvider,
      generatePageDataFolder,
      generateAppConfig,
      generatePageDataJSONFile,
      generatePageDataJSONZip
    } = this.releaseAppService;
    if (applicationCode) {
      let link = "";
      const folderName = `${applicationCode}_${curTime}`;
      const zipName = `${applicationCode}_${curTime}.zip`;
      try {
        const pageDataRes = await getPageDataFromProvider({ lesseeCode, applicationCode });
        if (pageDataRes.length > 0) {
          await generatePageDataFolder(folderName);
          await generateAppConfig(folderName, { lesseeCode, applicationCode });
          const createAllJSONFileRes = pageDataRes.map(async ({ id, pageContent, dataSources }) => {
            let tableMetaData;
            if (Array.isArray(dataSources) && dataSources.length > 0) {
              tableMetaData = await this.pageDataService.getTableMetadata(dataSources, {
                t: ""
              });
            }
            const dsl = this.pageDataService.pageData2IUBDSL({ pageContent }, { tableMetaData });
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
        throw new Error("没有页面可以发布");
      } catch (error) {
        console.log(error);
        resData.msg += `生成页面压缩文件失败，${error.toString()}`;
        return this.resHelperService.wrapResStruct(resData);
      }
    } else {
      resData.msg = "需要参数 app";
      return this.resHelperService.wrapResStruct(resData);
    }
  }
}
