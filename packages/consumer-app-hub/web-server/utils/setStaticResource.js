const express = require('express')
const path = require('path')
const config = require('../config.json')

const isMockServeMode = process.env.NODE_ENV === 'test'

const prodWebClientPath = config.staticWebClientPath
const mockWebClientPath = '../web-client/dist'

const serveWebClientPath = isMockServeMode ? mockWebClientPath : prodWebClientPath

const cwd = process.cwd()

module.exports = (app) => {
  app.use(express.static(path.join(cwd, serveWebClientPath)));
  app.use("/update-app", express.static(path.join(cwd, "/updateApp")));
  app.use("/public", express.static(path.join(cwd, "/public")));
}