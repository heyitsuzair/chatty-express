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
});
module.exports = mongoose.model("contacts", ContactsModel);
