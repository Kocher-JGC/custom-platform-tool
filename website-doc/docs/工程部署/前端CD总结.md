---
id: 前端 3.0 CD（持续部署）总结
slug: /前端 3.0 CD（持续部署）总结
hide_title: true
---


# 前端 3.0 CD（持续部署）总结

## 背景

经历了一段时间与运维同事的磨合，我们终于将前端 3.0 的 CI/CD 的流程走通了。

---

## 成果

前端 3.0 已经接入了 CI/CD

---

## CI 持续集成

持续集成是基于 Git + web hook + Jenkins + sonar + docker 的一套自动化检测 + 程序构建的流水线流程，目前前端 3.0 的 docker 资源可以在 [内部 docker 源](http://reg.hydevops.com/harbor/projects/11/repositories/provider-app-entry) 中访问。

---

## CD 持续部署

CD 的基础是 CI，我们有了 docker image，则需要一套部署机制，支持我们的系统持续交付。部署的过程是通过一系列 shell 脚本完成的，主要链路包含以下几个部分：

1. git flow 提交到 release 分支
2. Jenkins 流水线生成 docker image
3. 登录已经安装 docker 的虚拟机
4. 上传 CD 脚本到虚拟机
5. 在虚拟机上执行 CD 脚本
6. 通过 docker ps 查看部署结果
7. 通过 ip 访问

目前的前端的集成测试环境就是以上述流程完成 CD 的，可以通过 http://192.168.14.181:7070/ 访问配置工具。

---

## 未来优化

目前的整个 CD 的流程是耗时，从 git 提交到构建出 docker image，需要花费 20 分钟的时间，所以我们需要缩短当中的耗时，这里有几个方案：

1. 将前端的 build 改为并发同步进行
2. 做前端包的依赖分析，减少不必要的依赖，减少 build 的耗时
3. 将 node_modules 缓存到虚拟机的固定目录之中，减少每次 yarn 的时候到互联网下载包的时间

---

## 更多

...
