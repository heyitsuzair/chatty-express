const mongoose = require("mongoose");
const UsersModel = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  last_active: {
    type: "String",
    required: true,
    default: "Never",
  },
});
module.exports = mongoose.model("users", UsersModel);
