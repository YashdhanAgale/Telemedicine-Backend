const express = require("express");
const pharmacyRoutes = express.Router();
const { registerDevice } = require("../controllers/pharmacyController");

// Add validator if needed
pharmacyRoutes.post("/register", registerDevice);

module.exports = pharmacyRoutes;
