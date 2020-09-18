FROM reg.hydevops.com/3th_party/nginx:1.19.2-alpine

COPY $app_build_path /usr/share/nginx/html

EXPOSE 80