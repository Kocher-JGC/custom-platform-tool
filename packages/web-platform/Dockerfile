# dockerfile
# build stage
FROM node:lts-alpine as build-stage

RUN mkdir -p /tmp/web-platform-update/app/

WORKDIR /tmp/web-platform-update

COPY ./server ./

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
