const jwt = require("jsonwebtoken");
const MessagesModel = require("../models/MessagesModel");
const JWT_SECRET = process.env.JWT_SECRET;
const UsersModel = require("../models/UsersModel");

module.exports.socketConfig = (socket, io) => {
  io.on("connection", (socket) => {
    /**
     * When Someone Logs In
     */
    socket.on("onLogin", async (jwt_token) => {
      const data = jwt.verify(jwt_token, JWT_SECRET);
      const user_id = data.user_id;

      /**
       * Assign A "user_id" object to the socket
       */
      socket.user_id = user_id;

      /**
       * Broadcast (Except One That Logged In) Event To Frontend Whenever Any User Logs In
       */
      socket.broadcast.emit("userConnected", user_id);

      /**
       * Update User Last Active
       */
      const update_user = await UsersModel.findByIdAndUpdate(user_id, {
        last_active: "Online",
      });
    });

    /**
     * When Someone Sends Messages
     */
    socket.on("sendMessage", async (data) => {
      /**
       * Get Sender ID From JWT
       */
      const token = jwt.verify(data.update.sender_id, JWT_SECRET);
      data.update.sender_id = token.user_id;

      const update_message = await MessagesModel.findById(data.message_id);
      update_message.messages = [...update_message.messages, data.update];
      update_message.save();

      socket.emit("messageReceived", update_message);
    });
    /**
     * When Someone Sends Messages
     */
    socket.on("readingConversation", async (data) => {
      /**
       * Get Receiver ID From JWT
       */
      const token = jwt.verify(data.update.receiver_id, JWT_SECRET);
      data.update.receiver_id = token.user_id;

      const are_messages_seen = await MessagesModel.findOne({
        id: data.message_id,
        "messages.receiver_id": data.update.receiver_id,
        "messages.sender_id": data.update.sender_id,
      });

      if (are_messages_seen) {
        const newMessages = [];
        /**
         * Iterate Over Each Message And Make Its Seen True
         */
        for (let i = 0; i < are_messages_seen.messages.length; i++) {
          const message = are_messages_seen.messages[i];
          message.seen = true;
          newMessages.push(message);
        }

        are_messages_seen.messages = newMessages;
        are_messages_seen.save();
      }
    });

    /**
     * When Someone Closes Browser Or Tab
     */
    socket.on("disconnect", async (reason) => {
      const user_id = socket.user_id;

      /**
       * Triggers Only If User Was Logged In (User Id Is Not Null)
       *
       * Broadcast (Except One That Logged Out) Event To Frontend Whenever Any User Logs In
       */
      user_id && socket.broadcast.emit("userDisConnected", user_id);
      /**
       * Update User Last Active
       */
      const last_active = new Date();
      const update_user = await UsersModel.findByIdAndUpdate(user_id, {
        last_active,
      });
    });

    /**
     * When Someone Logs Out
     */
    socket.on("onLogout", async (jwt_token) => {
      const data = jwt.verify(jwt_token, JWT_SECRET);
      const user_id = data.user_id;

      /**
       * Broadcast (Except One That Logged Out) Event To Frontend Whenever Any User Logs In
       */
      socket.broadcast.emit("userDisConnected", user_id);
      /**
       * Update User Last Active
       */
      const last_active = new Date();
      const update_user = await UsersModel.findByIdAndUpdate(user_id, {
        last_active,
      });
    });
  });
};
