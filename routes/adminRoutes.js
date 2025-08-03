const express = require("express");

const {
  getOnlineDoctors,
  getActiveSessions,
  getDeviceMap,
} = require("../controllers/adminController");
const adminOnly = require("../middlewares/adminOnlyMiddleware");

const adminRoutes = express.Router();

adminRoutes.get("/online-doctors", adminOnly, getOnlineDoctors);
adminRoutes.get("/active-sessions", adminOnly, getActiveSessions);
adminRoutes.get("/device-map", adminOnly, getDeviceMap);

module.exports = adminRoutes;
