const express = require('express');
const path = require('path');
const config = require('../config.json');

const isMockServeMode = process.env.NODE_ENV === 'test';

const prodWebClientPath = config.staticWebClientPath;
const mockWebClientPath = '../web-client/dist';

const cwd = process.cwd();

module.exports = (app) => {
  if(isMockServeMode) {
    app.use(express.static(path.join(cwd, mockWebClientPath)));
  }
  app.use(express.static(path.join(cwd, prodWebClientPath)));
  app.use("/app-installation", express.static(path.join(cwd, "/static/updateApp")));
  app.use("/public", express.static(path.join(cwd, "/static/public")));
};