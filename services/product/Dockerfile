FROM node:latest

WORKDIR /usr/src/product

COPY ./package*.json /usr/src/product/

RUN npm install

COPY . /usr/src/product/

EXPOSE 4000

CMD ["node", "index.js"]