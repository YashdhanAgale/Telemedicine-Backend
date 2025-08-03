const Session = require("../models/Session");
const Doctor = require("../models/Doctor");
const PharmacyDevice = require("../models/PharmacyDevice");

exports.startSession = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "Device ID is required" });
    }

    // Check if device is registered
    const device = await PharmacyDevice.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: "Pharmacy device not found" });
    }

    // Find an available doctor
    const doctor = await Doctor.findOne({ isAvailable: true });
    if (!doctor) {
      return res.status(404).json({ message: "No available doctor found" });
    }

    // Create session
    const session = await Session.create({
      doctor: doctor._id,
      pharmacyDevice: device._id,
    });

    // Set doctor as unavailable (in session)
    doctor.isAvailable = false;
    await doctor.save();

    res.status(201).json({
      message: "Session started successfully",
      sessionId: session._id,
      doctor: {
        doctorId: doctor._id,
        name: doctor.name,
        email: doctor.email,
      },
      deviceId: device.deviceId,
      startedAt: session.startedAt,
    });
  } catch (err) {
    console.error("Session start error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.endSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const doctorId = req.user.userId; // comes from authMiddleware

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Make sure session belongs to this doctor
    if (session.doctor.toString() !== doctorId) {
      return res
        .status(403)
        .json({ message: "Access denied: Not your session" });
    }

    // Make sure session is active
    if (session.status !== "active") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // Mark session completed
    session.status = "completed";
    session.endedAt = new Date();
    await session.save();

    // Mark doctor available again
    const doctor = await Doctor.findById(doctorId);
    doctor.isAvailable = true;
    await doctor.save();

    res.status(200).json({ message: "Session ended successfully" });
  } catch (err) {
    console.error("End session error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    const sessions = await Session.find({ doctor: doctorId })
      .populate("pharmacyDevice", "deviceId gpsLocation")
      .sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Get my sessions error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
