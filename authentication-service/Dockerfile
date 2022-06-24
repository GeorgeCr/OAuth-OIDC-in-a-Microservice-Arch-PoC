FROM node:latest

WORKDIR /usr/src/authentication-service

COPY package*.json /usr/src/authentication-service/

RUN npm install

COPY . /usr/src/authentication-service/

EXPOSE 9000

CMD ["node", "index.js"]