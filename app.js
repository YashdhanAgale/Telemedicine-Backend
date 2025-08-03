const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const doctorRoutes = require("./routes/doctorRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://telemedicine-frontend-two.vercel.app",
  "https://telemedicine-frontend-fbqcr76xs-yashodhans-projects-7e631381.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes

app.use("/api/doctor", doctorRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
