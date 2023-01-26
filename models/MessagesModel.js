const mongoose = require("mongoose");
const MessagesModel = new mongoose.Schema({
  messages: {
    type: [
      {
        sender_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        receiver_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
});
module.exports = mongoose.model("messages", MessagesModel);
