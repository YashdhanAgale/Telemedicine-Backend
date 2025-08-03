const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://telemedicine-frontend-two.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server (with WebSocket) running on port ${PORT}`);
});
