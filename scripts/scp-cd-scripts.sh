pwd=$PWD

name=hydev
host=192.168.14.181

cd_source_dir=$pwd/cd
remote_target_dir=/var/custom-platform-fe/

rm -rf $cd_source_dir/app_env_config

mkdir -p $cd_source_dir/app_env_config

cp $cd_source_dir/app_env_config_storage/$host/* $cd_source_dir/app_env_config/

rsync -avcP -e ssh --exclude='/app_env_config_storage/' $cd_source_dir/* $name@$host:$remote_target_dir
# scp -r $pwd/cd/* ssh hydev@192.168.14.166:/var/custom-platform-fe/