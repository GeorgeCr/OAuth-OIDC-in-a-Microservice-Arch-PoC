FROM node:latest

WORKDIR /usr/src/authorization-service

COPY package*.json /usr/src/authorization-service/

RUN npm install

COPY . /usr/src/authorization-service/

EXPOSE 8000

CMD ["node", "index.js"]