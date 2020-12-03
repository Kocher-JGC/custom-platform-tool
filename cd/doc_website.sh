#/bin/bash

app_alias=doc_website
app_name=reg.hydevops.com/custom-platform-v3-frontend/doc_website
release_tag=release-main-flow

docker stop $app_alias

docker rm $app_alias

docker pull $app_name:$release_tag

docker run -d --name $app_alias -p 6677:80 $app_name:$release_tag