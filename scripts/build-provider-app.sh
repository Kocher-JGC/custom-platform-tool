# 保存当前的路径
pwd=$PWD

# echo "删除 yarn lock 文件，$pwd/yarn.lock，删除 node_modules"
# rm $pwd/yarn.lock
# rm -rf $pwd/node_modules

source_dir=$pwd/packages/provider-app/provider-app-entry

# 构建所有项目
cd $source_dir && yarn build
# && mv ./dist/* "$pwd/dist/provider-app"