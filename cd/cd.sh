#/bin/bash

echo -e "\033[34m stoping app: $app_alias \033[0m"

docker stop $app_alias

echo -e "\033[34m removing app: $app_alias \033[0m"

docker rm $app_alias

echo -e "\033[34m pulling app: $app_name:$release_tag \033[0m"
echo -e "\033[34m deploying app: $app_name:$release_tag \033[0m"

docker pull $app_name:$release_tag

echo -e "config path: \033[34m $app_config_path \033[0m"
echo -e "app source config path: \033[34m $app_target_env_config_path \033[0m"
echo -e "docker starting cmd: \033[34m docker run -d --name $app_alias -p $app_port:$app_source_port -v $app_config_path:$app_target_env_config_path $app_name:$release_tag \033[0m"

docker run -d --name $app_alias -p $app_port:$app_source_port -v $app_config_path:$app_target_env_config_path $app_name:$release_tag