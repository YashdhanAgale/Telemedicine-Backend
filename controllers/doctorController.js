const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER – optional
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists)
      return res.status(400).json({ message: "Doctor already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Doctor registered successfully",
      doctorId: doctor._id,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN — using your code (unchanged)
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: doctor._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        doctorId: doctor._id,
        doctorName: doctor.name,
        doctorEmail: doctor.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
exports.logoutDoctor = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.toggleAvailability = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isAvailable = !doctor.isAvailable;
    await doctor.save();

    // Emit WebSocket event to notify all connected clients
    const io = req.app.get("io");
    io.emit("doctorStatusChanged", {
      doctorId: doctor._id,
      name: doctor.name,
      isAvailable: doctor.isAvailable,
    });

    res.status(200).json({
      message: "Availability updated",
      isAvailable: doctor.isAvailable,
    });
  } catch (err) {
    console.error("Availability error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
