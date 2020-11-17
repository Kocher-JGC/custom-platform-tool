/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { access, ensureDir, readJson } = require("fs-extra");
const { exec } = require("child_process");
const config = require("./config.json");

const { uploadFolder } = config;

exports.checkFolder = function checkFolder(folder) {
  return new Promise((resolve) => {
    access(folder, (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

exports.createFolder = function createFolder(folder) {
  return new Promise((resolve, reject) => {
    ensureDir(folder, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

exports.unzip = function unzip(filename, folder) {
  return new Promise((resolve, reject) => {
    exec(`cd ${path.join(__dirname, uploadFolder, folder)} && tar -zxvf ${filename}`, (error) => {
      if (error) {
        console.log("解压文件失败", error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

exports.getZipName = function getZipName(originalName) {
  const arr = originalName.split(".");
  arr.pop();
  return arr.join(".");
};

exports.getAppConfig = function getAppConfig(originalName, folder) {
  return new Promise((resolve, reject) => {
    readJson(path.join(__dirname, uploadFolder, folder, "page", "main.json"), (err, json) => {
      if (err) {
        console.log("压缩包异常", err);
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
};

exports.removeFolder = function removeFolder(removePath) {
  return new Promise((resolve, reject) => {
    exec(`rm -rf ${removePath}`, (error) => {
      if (error) {
        console.log(`删除${removePath}目录失败`, error);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

exports.generateApp = function generateApp(appPath, folder) {
  return new Promise((resolve, reject) => {
    ensureDir(appPath, (err) => {
      if (err) {
        console.log(`创建${appPath}目录失败`, err);
        reject(err);
      } else {
        exec(
          `mv -f ${path.join(
            __dirname,
            uploadFolder,
            folder,
            "page"
          )}/* ${appPath} && rm -rf ${path.join(__dirname, uploadFolder, folder)}`,
          (error) => {
            if (error) {
              console.log(`移动${appPath}，${folder}目录失败`, err);
              reject(error);
            } else {
              resolve(true);
            }
          }
        );
      }
    });
  });
};
