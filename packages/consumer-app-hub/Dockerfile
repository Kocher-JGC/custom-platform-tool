# dockerfile
# build stage
FROM reg.hydevops.com/base_images/node:14.4-alpine3.12

RUN mkdir -p /usr/share/consumer-app/web-client/

WORKDIR /usr/share/consumer-app

COPY ./web-server ./

COPY ./web-client/dist ./web-client

EXPOSE 5020

CMD npm run serve
