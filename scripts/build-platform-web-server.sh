# 保存当前的路径
pwd=$PWD

source_dir=$pwd/packages/platform-web-server
# work_dir=$pwd/dist/web-server
# dist_dir=$work_dir/dist

# 构建所有项目
cd $source_dir && yarn build
#  && mv ./dist/* $dist_dir && cp ./Dockerfile $work_dir && cp ./node_modules $dist_dir