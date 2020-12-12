/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import axios from "axios";
// import { PageDataService } from "../page-data/page-data.service";
import config from "../../config";
import * as env from "../../env.json";

const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

const { paasServerUrl } = env;
const { pageDataStorePath } = config;

/**
 * 子进程运行 shell 方法
 */
const runExec = (shell: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (!shell) {
      reject(new Error(`${shell}命令不存在`));
    }
    exec(shell, (error) => {
      if (error) {
        reject(new Error(`执行${shell}命令失败`));
      } else {
        resolve(true);
      }
    });
  });
};

@Injectable()
export class ReleaseAppService {
  // constructor(private readonly pageDataService: PageDataService) {}

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  /**
   *
   * 生成页面 json 存放文件夹
   * @param {string} folderName 文件夹名称
   * @returns
   * @memberof ReleaseAppService
   */
  generatePageDataFolder(folderName: string, releaseId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!folderName || !releaseId) reject(new Error("文件夹名称错误"));
      fs.ensureDir(
        path.join(__dirname, pageDataStorePath, releaseId, "page", folderName),
        (err) => {
          if (err) {
            this.logger.error("生成页面 json 存放文件夹失败", err);
            reject(new Error("生成页面 json 存放文件夹失败"));
            return;
          }
          resolve(true);
        }
      );
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
    appConfig: { lesseeCode: string; applicationCode: string },
    releaseId: string
  ) {
    return new Promise((resolve, reject) => {
      const { lesseeCode, applicationCode } = appConfig;
      if (!lesseeCode || !applicationCode) reject(new Error("缺少应用信息"));
      fs.writeFile(
        path.join(__dirname, pageDataStorePath, releaseId, "page", `main.json`),
        JSON.stringify(appConfig),
        (err) => {
          if (err) {
            this.logger.error("生成应用配置信息失败", err);
            reject(new Error("生成应用配置信息失败"));
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
    releaseId: string,
    pageId: string,
    pageContent: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, pageDataStorePath, releaseId, "page", folderName, `${pageId}.json`),
        pageContent,
        (err) => {
          if (err) {
            this.logger.error("生成页面 json 文件失败", pageId, err);
            reject(new Error(`生成页面 json 文件失败 ${pageId}`));
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
  async generatePageDataJSONZip(
    folderName: string,
    zipName: string,
    releaseId: string
  ): Promise<string> {
    await runExec(
      `cd ${path.join(__dirname, pageDataStorePath, releaseId)} && tar -zcvf ${path.join(
        __dirname,
        pageDataStorePath,
        zipName
      )} page && cd ${path.join(__dirname, pageDataStorePath)} && rm -rf ${releaseId}`
    );
    return path.join(__dirname, pageDataStorePath, zipName);
  }

  /**
   *
   * 从配置端获取指定应用的页面数据集合
   * @param {string} applicationCode app应用标示
   * @returns
   * @memberof ReleaseAppService
   */
  async getPageDataFromProvider({ lesseeCode, applicationCode }, authorization) {
    const resData = await axios.get(
      `${paasServerUrl}/${lesseeCode}/${applicationCode}/page/v1/pages/publishing`,
      { headers: { Authorization: authorization } }
    );
    if (resData?.data?.code !== "00000") {
      this.logger.error("object", resData);
      throw new Error("获取应用已发布页面失败");
    }
    return resData?.data?.result || [];
  }
}
