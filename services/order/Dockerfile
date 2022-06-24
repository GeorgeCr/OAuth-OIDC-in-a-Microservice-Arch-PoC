FROM node:latest

WORKDIR /usr/src/order

COPY ./package*.json /usr/src/order

RUN npm install

COPY . /usr/src/order/

EXPOSE 4001

CMD ["node", "index.js"]