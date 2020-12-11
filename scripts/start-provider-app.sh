# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/provider-app/provider-app-entry

yarn && yarn start

# 构建 web 服务
# cd $source_dir/web-server
# yarn && npm start
