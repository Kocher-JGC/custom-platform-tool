# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/consumer-app-hub
npm ls @types/react

# 构建 web 服务
cd $source_dir/web-server
echo "进入 web-server 构建"
npm i
# ls node_modules

# 构建所有项目
cd $source_dir/web-client
echo "进入 web-client 构建"
yarn build
# && mv ./dist/* "$pwd/dist/web-platform"