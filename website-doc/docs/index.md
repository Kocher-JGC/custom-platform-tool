---
title: 自定义工具 3.0 工程文档
sidebar_label: 自定义工具 3.0 工程文档
hide_title: true
slug: /
---


# 自定义工具 3.0 前端工程介绍

采用 `monorepo` 前端工程结构，方便团队独立开发、调试，以及支持分布部署。

---

<!-- ## 1. 知识库

1. 整体
   - [系统架构](https://www.tapd.cn/41909965/documents/show/1141909965001000886?file_type=word&file_ext=0-%E5%89%8D%E7%AB%AF%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1v3)
2. 公用模块
   - [路由模块设计方案](https://www.tapd.cn/41909965/documents/show/1141909965001001066?file_type=word)
3. 配置端接入
   - [页面设计器方案](https://www.tapd.cn/41909965/documents/show/1141909965001001350?file_type=word)
   - [配置端业务模块接入](./平台接入/write-sub-app.md)
   - [平台组件接入](./docs/平台组件接入规则.md)
4. 应用端
   - [应用前端运行方案](https://www.tapd.cn/41909965/documents/show/1141909965001001298?file_type=word)
   - [应用端权限控制方案](https://www.tapd.cn/41909965/documents/show/1141909965001001065?file_type=word)
   - [IUB-DSL 引擎接入 TODO](TODO)
5. [工程部署](./docs/工程/deployment.md)

--- -->

## 1. 工程介绍（important）

### 1.1. 工程基础

整个自定义工具 3.0 前端的工程基础是基于 `yarn workspace` 的依赖包和文件目录管理搭建的，所以想要了解工程的基本，需要学习 yarn workspace 的基本概念。

[参考文章](https://blog.csdn.net/i10630226/article/details/99702447)

### 1.2. 查看 npm 包的依赖关系

通过 npm 自带的工具 `npm ls [package name]` 可以查看包的依赖关系，例如：

```shell
# 分析整个工程对于 react 的依赖关系
npm ls react
```

#### 1.2.1. 核心概念

`import` 的依赖是针对 `package.json` 中的 name 字段，而不是文件目录名称。

#### 1.2.2. 包管理、发布

包的版本管理、版本发布是通过 `lerna` 支持的。

### 1.3. 工程构建

工程的基础构建工具是 `webpack`。

---

## 2. 技术选型

- 工程管理
  - webpack
  - yarn
  - lerna
- 前端
  - 页面渲染
    - react
    - less
    - sass
  - 数据管理
    - redux
  - 基础工具
    - rxjs
  - 拖拽技术
    - react-dnd
  - 日期工具类
    - dayjs
- web 资源服务
  - node
    - nest：node 的 MVC 框架，node 版的 spring

---

## 3. 工程结构（Architecture）

### 3.1. 目录结构

项目总体方向如下：

- `__test__/` - 测试目录，可以放在任意目录
- `.bak/` - 备份文件
- `.template` 应用参考模版
- `.vscode/` - 编辑器配置
- `dist/` - 打包构建后的文件存放目录
- `docs/` - 文档
- `web-server` - 配置端 web 资源服务
- `packages/` - 工作区
  - `engine-*` `engine-` 开头的都是引擎相关的
  - `provider-app-*` - `provider-app-` 前缀的都是配置端相关的
  - `consumer-app-*` - `consumer-app-` 前缀的都是应用端相关的
  - `infra-*` - 基础设施支持
  - `ui-*` - 通用 UI 组件
  - `platform-access-*` - 平台接入
  - `*-hub` - 以 `hub` 结尾的都是嵌套工作区
  - `_*` - 以下划线`_`开头的是与工程没有直接关系的周边内容
- `.eslintignore` - eslint 中`需忽略的项`配置
- `.eslintrc` - eslint 配置
- `.gitignore` - git 中`需忽略的项`配置
- `jest.config.js` - jest 配置
- `lerna.json` - lerna 配置
- `package.json` - 工程 package json 配置
- `README.md` - 工程总说明文档
- `tsconfig.json` - typescript 的配置

---

## 4. 开发接入

项目启动所需的脚本都放在 `./scripts` 目录下。

### 4.1. 拉取代码准备

```shell
git clone https://github.com/SANGET/custom-platform-tool.git
yarn
```

### 4.2. 启动「配置前端」

```shell
yarn start:provider-app
```

### 4.3. 启动「应用前端」

```shell
yarn start:consumer-app
```

### 4.4. 启动「平台 web 资源服务」

```shell
yarn start:platform-web-server
```

---

## 5. 错误排查、处理

### 5.1. 依赖错误

`duplicate-identifier-LibraryManagedAttributes` 重复的标识 `LibraryManagedAttributes`。由于 @types/react 重复引用了不同版本导致的错误。解决方法是依赖同一个 @types/react 包。

---

## 6. 测试

通过 jest 测试，可以在需要测试的模块的目录下新建 `__test__` 目录并且写测试用例。然后在项目根目录执行 `yarn test` 即可进行测试。

每一个子应用都可以在自身目录的根目录下创建 `__test__` 文件夹，并且添加单元测试用例。

---

## 7. 最后

Thanks
