const express = require("express");
const sessionRoutes = express.Router();
const {
  startSession,
  endSession,
  getMySessions,
} = require("../controllers/sessionController");
const authMiddleware = require("../middlewares/authMiddleware");

// No auth needed for pharmacy initiating session (public)
sessionRoutes.post("/start", startSession);
sessionRoutes.put("/end/:sessionId", authMiddleware, endSession);
sessionRoutes.get("/my-sessions", authMiddleware, getMySessions);

module.exports = sessionRoutes;
