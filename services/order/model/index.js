import mongoose from "mongoose";

const Order = mongoose.model("Order", {
  product: {
    name: String,
    price: String,
  },
});

export default Order;
