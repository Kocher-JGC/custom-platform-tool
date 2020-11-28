# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/consumer-app-hub

cd $source_dir/web-client
yarn && yarn start

# 构建 web 服务
# cd $source_dir/web-server
# yarn && npm start
