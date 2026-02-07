require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { initSocket } = require("./backend/socket");

const connectDB = require("./backend/config/db");

// routes
const authRoutes = require("./backend/routes/authRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const chatRoutes = require("./backend/routes/chatRoutes");
const messageRoutes = require("./backend/routes/messageRoutes");
const feedbackRoutes = require("./backend/routes/feedbackRoutes");

const errorMiddleware = require("./backend/middleware/errorMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

initSocket(io);

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use(errorMiddleware);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  if (socket.user?.id) {
    socket.join(`user:${socket.user.id}`);
  }
});

// server start
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
