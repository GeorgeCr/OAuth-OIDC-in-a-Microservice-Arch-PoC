import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import nats from "nats";
import mongoose from "mongoose";
import Product from "./model/index.js";

// Message Queue

const nc = await nats.connect({ servers: process.env.NATS_URI });

const jc = nats.JSONCodec();

// DB

mongoose.connect(
  process.env.MONGODB_CONNSTRING,
  {
    dbName: "PRODUCT",
  },
  (err) => {
    if (err) {
      console.error(err, "wut?");
      process.exit(1);
    }
  }
);

const app = new Koa();
app.use(bodyParser());

const router = new Router();

router.post("/product", async (ctx) => {
  // const { name, price } = ctx.request.body;
  const name = ctx.request.headers["x-product-name"];
  const price = ctx.request.headers["x-product-price"];

  const toInsertProduct = new Product({ name, price });
  await toInsertProduct.save();

  nc.publish(
    "PRODUCT_CREATED",
    jc.encode({
      name,
      price,
    })
  );
  ctx.response.status = 201;
  ctx.body = {
    saved: true,
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000);
