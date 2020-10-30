/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PageDataService } from "../page-data/page-data.service";
import config from "../../config";

const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");

const baseUrl = "http://192.168.14.140:6090";
const lesseeCode = "hy";

/**
 * 子进程运行 shell 方法
 */
const runExec = (shell: string): Promise<boolean> => {
  console.log("shell", shell);
  return new Promise((resolve, reject) => {
    if (!shell || typeof shell !== "string") reject(new Error("命令不存在"));
    exec(shell, (error) => {
      if (error) {
        console.log(999, shell, error, typeof error);
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
      if (typeof folderName !== "string") reject(new Error("文件夹名称错误"));
      fs.ensureDir(path.join(config.pageDataStoreDirectory, folderName), (err) => {
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
        path.join(config.pageDataStoreDirectory, folderName, `${pageId}.json`),
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

  // removePageDataFolder(folderName: string): Promise<boolean> {
  //   return runExec(``);
  // }

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
  async getPageDataFromProvider(applicationCode: string) {
    const resData = await axios.get(
      `${baseUrl}/paas/${lesseeCode}/${applicationCode}/page/v1/pages/publishing`,
      {
        headers: {
          Authorization: `Bearer 1295915065878388737`
        }
      }
    );
    return resData?.data?.result || [];
  }

  /**
   *
   * 从配置端获取指定应用的指定页面详情
   * @param {string} applicationCode app应用标示
   * @param {string} pageId 页面 ID
   * @returns
   * @memberof ReleaseAppService
   */
  async getPageDetailFromProvider(applicationCode: string, pageId: string) {
    const dsl = await this.pageDataService.getPageDataFromRemote({
      lessee: lesseeCode,
      app: applicationCode,
      id: pageId
    });
    return dsl;
  }

  hasFile(folderName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(config.pageDataStoreDirectory, `${folderName}.zip`);
      fs.access(filePath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(filePath);
      });
    });
  }
}
