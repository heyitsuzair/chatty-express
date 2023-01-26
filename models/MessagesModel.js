const mongoose = require("mongoose");
const MessagesModel = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true,
  },
  messages: {
    type: [
      {
        receiver_id: mongoose.Schema.Types.ObjectId,
        ref: "users",
        message: "",
      },
    ],
    required: true,
    default: [],
  },
});
module.exports = mongoose.model("messages", MessagesModel);
