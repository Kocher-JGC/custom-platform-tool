# 应用的名称
app_name=reg.hydevops.com/custom-platform-v3-frontend/provider_app

# 应用的别名
app_alias=provider_app

# 发布的分支
release_tag=release-main-flow

app_config_path=$deploy_dir/provider-app-config.json
app_target_env_config_path=/usr/share/nginx/html/config.json

app_port=5010
app_source_port=80

. ./cd.sh
