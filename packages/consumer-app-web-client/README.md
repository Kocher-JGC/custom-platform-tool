# 应用发布

## 1. 具体流程

### 1.1 生成页面配置文件压缩包

> 代码位置 provider-app-hub/Dashboard/Dashboard.tsx 158

1. 在配置端应用列表页面选择需要发布的应用
2. 点击右上角选项“发布按钮”
3. 浏览器会自动下载前端和后端的压缩包

### 1.2 生成应用端

> 暂时采用 node 管理应用端的静态文件，node 代码位置 web-platform/server，生成 docker 前需要先对应用项目进行打包以及 node 服务要安装依赖

生成 docker 镜像命令，实际是将生成好的 dist 和整个 node 项目（包含 node_modules）拷贝到 docker 内并启动，在 web-platform 目录下执行，web-platform-image 为镜像名称，可自定义

```shell
docker build . -t web-platform-image:latest
```

启动 docker，-d 后台运行容器，并返回容器ID，-p 3000:3000 意义为（宿主端口:docker 端口） docker 内启动的 node 服务的端口 3000 映射到宿主机器的 3000，web-platform-container 为容器名称，web-platform-image:latest 为镜像的名称及版本

``` shell
docker run -d -p 3000:3000 --name web-platform-container web-platform-image:latest
```

查看启动的 docker

``` shell
docker ps -a
```

查看启动的 docker 内的目录结构，58775251d0e8 是容器 ID，通过从上一个命令获取

``` shell
docker exec 58775251d0e8 ls /usr/src/web-platform-update/app/
```

### 1.3 上传页面

启动 docker 后，直接访问（localhost:3000）但菜单还无法访问，需要上传步骤 1.1 得到的压缩包，如果在在本机启动是通过 postman 访问 localhost:3000/upload 上传压缩包，此操作会把 压缩包内的 main.json (应用配置信息)和 page 文件夹（包含所有页面文件）解压到应用端打包文件位置（/usr/src/web-platform-update/app）

## 2.已知问题

第 1 和 2 点，晚上处理 11/5

1. 下载压缩包报错提示不明确
2. 缺少上传页面
3. 代码注释
4. 单元测试
