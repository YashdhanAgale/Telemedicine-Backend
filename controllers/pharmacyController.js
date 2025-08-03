const PharmacyDevice = require("../models/PharmacyDevice");

exports.registerDevice = async (req, res) => {
  try {
    const { deviceId, gpsLocation } = req.body;

    if (!deviceId || !gpsLocation || !gpsLocation.lat || !gpsLocation.lng) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDevice = await PharmacyDevice.findOne({ deviceId });
    if (existingDevice) {
      return res.status(400).json({ message: "Device already registered" });
    }

    const device = await PharmacyDevice.create({
      deviceId,
      gpsLocation,
    });

    res.status(201).json({
      message: "Pharmacy device registered successfully",
      device,
    });
  } catch (err) {
    console.error("Device registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
