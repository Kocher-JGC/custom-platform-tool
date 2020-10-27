# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/provider-app-entry

# 构建所有项目
cd $source_dir && yarn build
# && mv ./dist/* "$pwd/dist/provider-app"