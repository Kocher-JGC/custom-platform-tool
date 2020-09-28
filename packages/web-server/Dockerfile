FROM reg.hydevops.com/base_images/node:14.4-alpine3.12

ARG APP_PATH

WORKDIR  /app

COPY $APP_PATH ./

RUN true \
    && npm config set registry  http://nexus.hydevops.com/repository/npm-hy-frontend-group/ \
    && npm install -g pm2 

EXPOSE 3000

CMD pm2 start ./main.js