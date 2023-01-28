const mongoose = require("mongoose");
const ContactsModel = new mongoose.Schema({
  friend_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  messages: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "messages",
    required: true,
  },
});
module.exports = mongoose.model("contacts", ContactsModel);
