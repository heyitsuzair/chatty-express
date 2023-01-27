const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

/**
 * Socket.io configuration
 */
const socket = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const { socketConfig } = require("./sockets");

const io = socket(server, {
  cors: {
    origin: process.env.APP_URL,
  },
}); //in case server and client run on different urls

socketConfig(socket, io);

app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);

const authRoutes = require("./routes/UserRoutes");
const contactRoutes = require("./routes/ContactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

server.listen(process.env.PORT, () => {
  console.log("Listening On " + process.env.PORT);
});
