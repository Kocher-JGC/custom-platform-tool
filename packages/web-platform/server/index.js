/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const multer = require('multer');
const { access, ensureDir, readJson } = require('fs-extra');
const { exec } = require('child_process');
// const cors = require('cors');
const config = require('./config.json');

const app = express();
const { uploadFolder, projectFolder } = config;
// app.use(cors());
app.use(express.static(path.join(__dirname, '/app')));
app.use('/update-app', express.static(path.join(__dirname, '/updateApp')));
app.use('/public', express.static(path.join(__dirname, '/public')));

const checkFolders = (name, cb) => {
  access(name, (err) => {
    err
      ? ensureDir(projectFolder, (err1) => {
        err1 ? cb(err1) : cb(null);
      })
      : cb(null);
  });
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    access(uploadFolder, (err) => {
      err
        ? ensureDir(uploadFolder, (err1) => {
          err1 ? cb(err1) : cb(null, uploadFolder);
        })
        : cb(null, uploadFolder);
    });
  },
  filename(req, file, cb) {
    const tmp = file.originalname.split("-");
    if (!tmp[1]) {
      cb(new Error("压缩包名称异常"));
    } else {
      cb(null, tmp[1]);
    }
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
          const tmp1 = file.originalname.split("-");
          const tmp2 = tmp1[1].split('.');
          const folder = tmp2[0];
          exec(
            `cd ${uploadFolder} && tar -zxvf ${tmp1[1]} && rm -rf ${projectFolder}/page && rm -rf ${projectFolder}/main.json && mv -f ${folder}/* ${projectFolder}`,
            (unzipError) => {
              if (unzipError) {
                res.json(returnError(unzipError));
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
      });
    }
  });
});

app.listen(config.port, () => {
  console.log('启动应用端更新服务成功');
});
