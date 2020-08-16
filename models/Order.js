const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  pizza: String,
  toppings: String,
  size: String,
  name: String,
  phone: String,
  address: String,
  orderid: String,
});

mongoose.model("order", orderSchema);
