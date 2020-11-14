/* eslint-disable @typescript-eslint/no-var-requires */
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

const app = express();
const { uploadFolder, projectFolder } = config;
app.use(cors());
app.use(express.static(path.join(__dirname, "/app")));
app.use("/update-app", express.static(path.join(__dirname, "/updateApp")));
app.use("/public", express.static(path.join(__dirname, "/public")));

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
  upload(req, res, async (uploadErr) => {
    if (uploadErr) {
      console.log("上传出错", uploadErr);
      res.json({ code: "10000", msg: "上传出错" });
    } else {
      try {
        const { file } = req;
        const folder = getZipName(file.originalname);
        const has = await checkFolder(path.join(__dirname, projectFolder));
        if (!has) {
          await createFolder(path.join(__dirname, projectFolder));
        }
        await unzip(file.originalname, folder);
        const appConfig = await getAppConfig(file.originalname, folder);
        if (appConfig && appConfig.applicationCode) {
          const appPath = path.join(__dirname, projectFolder, appConfig.applicationCode);
          const has2 = checkFolder(appPath);
          if (has2) {
            await removeFolder(appPath);
          }
          await generateApp(appPath, folder);
        }
      } catch (error) {
        res.json({ code: "10000", msg: error.toString() });
      }
    }
  });
});

app.listen(config.port, () => {
  console.log("启动应用端更新服务成功");
});
