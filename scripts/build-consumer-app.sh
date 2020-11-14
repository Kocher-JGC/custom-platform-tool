# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/consumer-app-web-client

cd ${pwd}/packages/consumer-app-web-server
yarn

# 构建所有项目
cd $source_dir && yarn build
# && mv ./dist/* "$pwd/dist/web-platform"