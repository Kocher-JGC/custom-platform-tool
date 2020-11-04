/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const multer = require('multer');
const { access, ensureDir, readJson } = require('fs-extra');
const { exec } = require('child_process');
const config = require('./config.json');

const app = express();
const { uploadFolder, projectFolder } = config;
app.use(express.static(path.join(__dirname, '/app')));

const checkFolders = (name, cb) => {
  access(name, (err) => {
    err
      ? ensureDir(projectFolder, (err1) => {
        err1 ? cb(new Error('创建暂存文件夹失败')) : cb(null);
      })
      : cb(null);
  });
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    access(uploadFolder, (err) => {
      err
        ? ensureDir(uploadFolder, (err1) => {
          err1 ? cb(new Error('创建暂存文件夹失败')) : cb(null, uploadFolder);
        })
        : cb(null, uploadFolder);
    });
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.originalname.toLowerCase().indexOf('zip') !== -1) {
      cb(null, true);
    } else {
      cb(new Error('请上传正确的压缩包格式 zip'));
    }
  },
}).single('file');

const returnError = (err) => ({
  result: null,
  code: '10000',
  msg: err.toString(),
});

app.get('/node-web/page-data', (req, res) => {
  const { id } = req.query;
  readJson(path.join(__dirname, '/app', '/page', `/${id}.json`), (err, json) => {
    if (err) {
      res.json({
        err: err.toString(),
        code: '10000'
      });
    } else {
      res.json(json);
    }
  });
});

app.post('/upload', (req, res) => {
  upload(req, res, (uploadErr) => {
    if (uploadErr) {
      res.json(returnError(uploadErr));
    } else {
      const { file } = req;
      checkFolders(projectFolder, (checkErr) => {
        if (checkErr) {
          res.json(returnError(checkErr));
        } else {
          exec(
            `cd ${uploadFolder} && tar -zxvf ${file.originalname}`,
            (unzipError) => {
              if (unzipError) {
                res.json(returnError(unzipError));
              } else {
                const tmpArr = file.originalname.split('.');
                const folder = tmpArr[0];
                exec(
                  `cd ${uploadFolder} && mv -f ${folder}/* ${projectFolder} `,
                  (mvError) => {
                    if (mvError) {
                      console.log(mvError);
                      res.json(returnError(mvError));
                    } else {
                      res.json({
                        result: null,
                        code: '00000',
                        msg: '更新成功',
                      });
                    }
                  }
                );
              }
            }
          );
        }
      });
    }
  });
});

app.listen(config.port, () => {
  console.log('启动应用端更新服务成功');
});
