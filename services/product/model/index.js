import mongoose from "mongoose";

const Product = mongoose.model("Product", { name: String, price: String });

export default Product;
