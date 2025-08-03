const express = require("express");
const router = express.Router();
const {
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  toggleAvailability,
} = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddleware");
const Doctor = require("../models/Doctor");

router.post("/register", registerDoctor); // optional
router.post("/login", loginDoctor);
router.post("/logout", logoutDoctor);
router.put("/availability", authMiddleware, toggleAvailability);

// routes/doctorRoutes.js
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.userId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      isAvailable: doctor.isAvailable,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
