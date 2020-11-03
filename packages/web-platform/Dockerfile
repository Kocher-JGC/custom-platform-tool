# dockerfile
# build stage
FROM node:lts-alpine as build-stage
RUN mkdir -p /usr/src/web-platform/
WORKDIR /usr/src/web-platform
COPY server ./
WORKDIR /usr/src/web-platform/server
CMD npm start

# production stage
FROM nginx:stable-alpine as production-stage
WORKDIR /usr/src/web-platform
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
