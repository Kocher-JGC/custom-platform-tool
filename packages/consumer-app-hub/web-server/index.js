const express = require("express");
const path = require("path");
const multer = require("multer");
const { access, ensureDir, readJson } = require("fs-extra");
const cors = require("cors");
const {
  checkFolder,
  createFolder,
  unzip,
  getZipName,
  getAppConfig,
  generateApp,
  removeFolder
} = require("./utils");
const config = require("./config.json");

// require('./utils/setup-consumer-app-web-client')
const setStaticResource = require('./utils/setStaticResource')

const app = express();
const { uploadFolder, projectFolder } = config;
app.use(cors());

setStaticResource(app);

// app.use(express.static(path.join(__dirname, "/web-client")));
// app.use("/app-installation", express.static(path.join(__dirname, "/updateApp")));
// app.use("/public", express.static(path.join(__dirname, "/public")));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = getZipName(file.originalname);
    const p = path.join(__dirname, uploadFolder, folder);
    console.log("上传路径", p);
    access(p, (error) => {
      if (error) {
        console.log("没有上传路径");
        ensureDir(p, (err1) => {
          err1 ? cb(err1) : cb(null, p);
        });
      } else {
        console.log("存在上传路径");
        cb(null, p);
      }
    });
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.originalname.toLowerCase().indexOf("zip") !== -1) {
      cb(null, true);
    } else {
      cb(new Error("请上传正确的压缩包格式 zip"));
    }
  }
}).single("file");

app.get("/node-web/page-data", (req, res) => {
  const { id } = req.query;
  const appCode = req.query.app;
  readJson(path.join(__dirname, projectFolder, appCode, "data", `${id}.json`), (err, json) => {
    if (err) {
      console.log("获取页面文件失败", err);
      res.json({
        err: "获取页面文件失败",
        code: "10000"
      });
    } else {
      res.json(json);
    }
  });
});

app.post("/upload", (req, res) => {
  upload(req, res, (uploadErr) => {
    if (uploadErr) {
      console.log("上传出错", uploadErr);
      res.json({ msg: "上传出错" });
    } else {
      const { file } = req;
      const folder = getZipName(file.originalname);

      // 不存在项目目录就创建
      checkFolder(path.join(__dirname, projectFolder)).then((has) => {
        if (has) {
          console.log("存在项目路径");
          // 将上传文件解压
          unzip(file.originalname, folder)
            .then(() => {
              getAppConfig(file.originalname, folder)
                .then((appConfig) => {
                  if (appConfig && appConfig.applicationCode) {
                    // 检查项目内 app 文件夹是否存在
                    const appPath = path.join(__dirname, projectFolder, appConfig.applicationCode);
                    checkFolder(appPath).then((hasApp) => {
                      if (hasApp) {
                        // 如果存在，先删除，再创建
                        removeFolder(appPath)
                          .then(() => {
                            generateApp(appPath, folder)
                              .then(() => {
                                res.json({ code: "00000", msg: "安装成功" });
                              })
                              .catch(() => {
                                res.json({ code: "10000", msg: "生成 app 目录失败" });
                              });
                          })
                          .catch(() => {
                            // 删除 app 目录失败
                            res.json({ code: "10000", msg: "删除 app 目录失败" });
                          });
                      } else {
                        // 没有直接创建和移动
                        generateApp(appPath, folder)
                          .then(() => {
                            res.json({ code: "00000", msg: "安装成功" });
                          })
                          .catch(() => {
                            res.json({ code: "10000", msg: "生成 app 目录失败" });
                          });
                      }
                    });
                  } else {
                    // 压缩包内容异常
                    res.json({ code: "10000", msg: "压缩包配置文件异常" });
                  }
                })
                .catch(() => {
                  // 压缩包异常
                  res.json({ code: "10000", msg: "压缩包缺少配置文件" });
                });
            })
            .catch((error) => {
              console.log("解压文件失败", error);
              res.json({ msg: "解压文件失败" });
            });
          // res.json({ code: "00000", msg: 2 });
          // 获取应用配置
        } else {
          console.log("没有项目路径");
          createFolder(path.join(__dirname, projectFolder))
            .then(() => {
              // 将上传文件解压
              unzip(file.originalname, folder)
                .then(() => {
                  getAppConfig(file.originalname, folder)
                    .then((appConfig) => {
                      if (appConfig && appConfig.applicationCode) {
                        // 检查项目内 app 文件夹是否存在
                        const appPath = path.join(
                          __dirname,
                          projectFolder,
                          appConfig.applicationCode
                        );
                        checkFolder(appPath).then((hasApp) => {
                          if (hasApp) {
                            // 如果存在，先删除，再创建
                            removeFolder(appPath)
                              .then(() => {
                                generateApp(appPath, folder)
                                  .then(() => {
                                    res.json({ code: "00000", msg: "安装成功" });
                                  })
                                  .catch(() => {
                                    res.json({ code: "10000", msg: `"生成 ${projectFolder} 目录失败"` });
                                  });
                              })
                              .catch(() => {
                                // 删除 app 目录失败
                                res.json({ code: "10000", msg: `"删除 ${projectFolder} 目录失败"` });
                              });
                          } else {
                            // 没有直接创建和移动
                            generateApp(appPath, folder)
                              .then(() => {
                                res.json({ code: "00000", msg: "安装成功" });
                              })
                              .catch(() => {
                                res.json({ code: "10000", msg: `"生成 ${projectFolder} 目录失败"` });
                              });
                          }
                        });
                      } else {
                        // 压缩包内容异常
                        res.json({ code: "10000", msg: "压缩包配置文件异常" });
                      }
                    })
                    .catch(() => {
                      // 压缩包异常
                      res.json({ code: "10000", msg: "压缩包缺少配置文件" });
                    });
                })
                .catch((error) => {
                  console.log("解压文件失败", error);
                  res.json({ msg: "解压文件失败" });
                });
            })
            .catch((error) => {
              console.log("创建目录失败", error);
              res.json({ code: "10000" });
            });
        }
      });
      // 将上传文件解压
      // 获取应用配置
      // 准备应用配置文件夹（置为空）
    }
  });
});

// TODO 代码优化
// 删除压缩包

app.listen(config.port, () => {
  console.log("启动应用端更新服务成功");
});
