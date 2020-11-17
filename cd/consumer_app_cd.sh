# 应用的名称
app_name=reg.hydevops.com/custom-platform-v3-frontend/consumer_app

# 应用的别名
app_alias=consumer_app

# 发布的分支
release_tag=release-main-flow

app_config_path=$deploy_dir/consumer-app-config.json
app_target_env_config_path=/usr/share/consumer-app/web-client/config.json
# app_target_env_config_path=/usr/share/nginx/html/config.json

app_port=5020
app_source_port=3000

. ./cd.sh
