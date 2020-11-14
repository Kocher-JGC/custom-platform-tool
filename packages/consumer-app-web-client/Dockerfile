# dockerfile
# build stage
FROM reg.hydevops.com/base_images/node:14.4-alpine3.12

RUN mkdir -p /usr/share/web-platform-update/app/

WORKDIR /usr/share/web-platform-update

COPY ./server ./

COPY ./dist ./app

EXPOSE 5020

CMD npm run start
