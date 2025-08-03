const Doctor = require("../models/Doctor");
const Session = require("../models/Session");
const PharmacyDevice = require("../models/PharmacyDevice");

// GET /api/admin/online-doctors
exports.getOnlineDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isAvailable: true }).select(
      "-password"
    );
    res.status(200).json({ doctors });
  } catch (err) {
    console.error("Online doctors error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/active-sessions
exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("doctor", "name email")
      .populate("pharmacyDevice", "deviceId gpsLocation");
    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Active sessions error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/device-map
exports.getDeviceMap = async (req, res) => {
  try {
    const devices = await PharmacyDevice.find().select("deviceId gpsLocation");
    res.status(200).json({ devices });
  } catch (err) {
    console.error("Device map error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
