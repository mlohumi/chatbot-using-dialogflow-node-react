const mongoose = require("mongoose");
const { Schema } = mongoose;

const leadSchema = new Schema({
  name: String,
  email: String,
  phone: String,
});

mongoose.model("lead", leadSchema);
