# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/provider-app/provider-app-entry

cd $source_dir
yarn && yarn start

# 构建 web 服务
# yarn && npm start
