# dockerfile
# build stage
FROM reg.hydevops.com/base_images/node:14.4-alpine3.12

RUN mkdir -p /tmp/web-platform-update/app/

WORKDIR /tmp/web-platform-update

COPY ../consumer-app-web-server ./

COPY ./dist ./app

EXPOSE 5020

CMD npm run start

# production stage
# FROM nginx:stable-alpine as production-stage
# WORKDIR /tmp/web-platform
# COPY dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
