const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
connectDB();

const server = http.createServer(app); // ✅ right way
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend Vite port
    credentials: true,
  },
});

// Expose io globally to use in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ❗ FIX HERE
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server (with WebSocket) running on port ${PORT}`);
});
