# 应用的名称
app_name=reg.hydevops.com/custom-platform-v3-frontend/node_web_server

# 应用的别名
app_alias=node_web_server

# 发布的分支
release_tag=release-main-flow

app_config_path=$deploy_dir/node-web-app-config.js
app_target_env_config_path=/var/node-web-server/config.js

app_port=5100
app_source_port=3000

. ./cd.sh