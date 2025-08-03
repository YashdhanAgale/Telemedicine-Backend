const mongoose = require("mongoose");

const pharmacyDeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    gpsLocation: {
      type: {
        lat: Number,
        lng: Number,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PharmacyDevice", pharmacyDeviceSchema);
