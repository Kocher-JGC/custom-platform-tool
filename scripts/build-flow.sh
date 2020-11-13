# 清除工作区
# rm -rf $dist_dir

# # 创建文件夹
# mkdir -p $dist_dir

cd $pwd/packages/web-server && yarn build && mv ./dist/* $dist_dir/dist && cp ./Dockerfile $dist_dir
