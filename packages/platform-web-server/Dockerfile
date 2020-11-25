FROM node:lts-alpine as build-stage

WORKDIR  /var/node-web-server

COPY ./dist ./
COPY ./node_modules ./node_modules

# ENV HOST 0.0.0.0

# RUN true \
#     && npm config set registry  http://nexus.hydevops.com/repository/npm-hy-frontend-group/ \
#     && npm install -g pm2

EXPOSE 3000

CMD ["node", "src/main.js"]
