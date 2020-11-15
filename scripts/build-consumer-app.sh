# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/consumer-app-hub

# 构建 web 服务
cd $source_dir/web-server
yarn

# 构建所有项目
cd $source_dir/web-client
yarn build
# && mv ./dist/* "$pwd/dist/web-platform"