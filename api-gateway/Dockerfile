FROM node:latest

WORKDIR /usr/src/proxy

COPY ./package*.json /usr/src/proxy/

RUN npm install

COPY . /usr/src/proxy/

EXPOSE 6000

CMD ["node", "index.js"]