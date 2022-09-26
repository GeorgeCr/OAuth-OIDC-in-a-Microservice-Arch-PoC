import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Router from "@koa/router";
import nats from "nats";
import mongoose from "mongoose";
import Order from "./model/index.js";

const nc = await nats.connect({ servers: process.env.NATS_URI });

mongoose.connect(
  process.env.MONGODB_CONNSTRING,
  {
    dbName: "ORDER",
  },
  (err) => {
    if (err) {
      process.exit(1);
    }
  }
);

const jc = nats.JSONCodec();
const sub = nc.subscribe("PRODUCT_CREATED");
for await (const m of sub) {
  const product = jc.decode(m.data);
  const { name, price } = product;

  const toInsertOrder = new Order({
    product: {
      name,
      price,
    },
  });

  try {
    await toInsertOrder.save();
  } catch (err) {
    console.log(err, "whyyy");
  }
}

const app = new Koa();
app.use(bodyParser());

const router = new Router();

router.get("/health", (ctx) => {
  ctx.body = "Proxied to order health";
});

router.post("/order/:id", async (ctx) => {
  const { id } = ctx.params;
  ctx.body = `Product number ${id}`;
});

router.post("/order/event", (ctx) => {
  const { id, data } = ctx.request.body;
  ctx.body = `Received event from product... ${id} ${data}`;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(4001);
