# dockerfile
# build stage
FROM node:lts-alpine as build-stage
RUN mkdir -p /usr/src/web-platform-update/app
WORKDIR /usr/src/web-platform-update/app
COPY dist ./
WORKDIR /usr/src/web-platform-update
COPY server ./
EXPOSE 3300
CMD npm run start

# production stage
# FROM nginx:stable-alpine as production-stage
# WORKDIR /usr/src/web-platform
# COPY dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
