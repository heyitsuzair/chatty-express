const jwt = require("jsonwebtoken");
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
     * When Someone Closes Browser Or Tab
     */
    socket.on("disconnect", async () => {
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
