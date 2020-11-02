/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PageDataService } from "../page-data/page-data.service";
import config from "../../config";

const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

/**
 * 子进程运行 shell 方法
 */
const runExec = (shell: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!shell) reject(new Error("命令不存在"));
    exec(shell, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

@Injectable()
export class ReleaseAppService {
  constructor(private readonly pageDataService: PageDataService) {}

  /**
   *
   * 生成页面 json 存放文件夹
   * @param {string} folderName 文件夹名称
   * @returns
   * @memberof ReleaseAppService
   */
  generatePageDataFolder(folderName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!folderName) reject(new Error("文件夹名称错误"));
      fs.ensureDir(path.join(config.pageDataStoreDirectory, folderName, "/page"), (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  }

  /**
   *
   * 生成应用配置信息
   * @param {string} folderName 放置文件夹
   * @param {{ lesseeCode: string; applicationCode: string }} appConfig 应用配置文件 json 内容
   * @returns
   * @memberof ReleaseAppService
   */
  generateAppConfig(
    folderName: string,
    appConfig: { lesseeCode: string; applicationCode: string }
  ) {
    return new Promise((resolve, reject) => {
      const { lesseeCode, applicationCode } = appConfig;
      if (!lesseeCode || !applicationCode) reject(new Error("缺少应用信息"));
      fs.writeFile(
        path.join(config.pageDataStoreDirectory, folderName, `appConfig.json`),
        JSON.stringify(appConfig),
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  /**
   *
   * 生成页面 json 文件
   * @param {string} folderName 文件夹名称
   * @param {string} pageId 页面 ID
   * @param {string} pageContent 内容
   * @returns {Promise<boolean>}
   * @memberof ReleaseAppService
   */
  generatePageDataJSONFile(
    folderName: string,
    pageId: string,
    pageContent: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(config.pageDataStoreDirectory, folderName, "/page", `${pageId}.json`),
        pageContent,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
  }

  /**
   *
   * 生成压缩文件
   * @param {string} folderName 源文件夹名称
   * @param {string} zipName 压缩包名称
   * @param {number} fileLength 需要处理的长度
   * @returns {Promise<boolean>}
   * @memberof ReleaseAppService
   */
  async generatePageDataJSONZip(folderName: string, zipName: string): Promise<string> {
    await runExec(
      `cd ${path.join(config.pageDataStoreDirectory)} && tar -zcvf ${zipName} ${path.join(
        folderName
      )} && rm -rf ${path.join(folderName)}`
    );
    return path.join(config.pageDataStoreDirectory, zipName);
  }

  /**
   *
   * 从配置端获取指定应用的页面数据集合
   * @param {string} applicationCode app应用标示
   * @returns
   * @memberof ReleaseAppService
   */
  async getPageDataFromProvider({ lesseeCode, applicationCode }) {
    const resData = await axios.get(
      `${config.platformApiUrl}/paas/${lesseeCode}/${applicationCode}/page/v1/pages/publishing`,
      {
        headers: {
          Authorization: `Bearer 1295915065878388737`
        }
      }
    );
    return resData?.data?.result || [];
  }
}
